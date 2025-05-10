using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API.Controllers
{
    [Authorize]
    public class UsersController(IUserRepository userRepository,
        IMapper mapper, IPhotoService photoService) : BaseApiController
    {
        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await userRepository.GetMembersAsync();

            return Ok(users);
        }

        [HttpGet("{username}")]
        public async Task<IActionResult> GetUser(string username)
        {
            var user = await userRepository.GetMemberByUsernameAsync(username);

            if (user == null) return NotFound();

            return Ok(user);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
        {
            var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());

            if (user == null) return BadRequest("Could not find user.");

            mapper.Map(memberUpdateDto, user);

            if (await userRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Failed to update the user.");
        }

        [HttpPost("add-photo")]
        public async Task<IActionResult> AddPhoto(IFormFile file)
        {
            var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());

            if (user == null) return BadRequest("Could not find user.");

            var result = await photoService.UploadPhotoAsync(file);

            if (result.Error != null) return BadRequest(result.Error.Message);

            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId,
            };

            user.Photos.Add(photo);

            if (await userRepository.SaveAllAsync())
                return CreatedAtAction(nameof(GetUser), 
                    new { username = user.UserName }, mapper.Map<PhotoDto>(photo));

            return BadRequest("Problem uploading photo.");
        }

        [HttpPut("set-main-photo/{photoId:int}")]
        public async Task<IActionResult> SetMainPhoto(int photoId)
        {
            var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());

            if (user == null) return BadRequest("Could not find user.");

            var photo = user.Photos.FirstOrDefault(p => p.Id == photoId);

            if (photo == null || photo.IsMain) return BadRequest("Cannot use this as main photo.");

            var currentMain = user.Photos.FirstOrDefault(p => p.IsMain);
            if (currentMain != null)currentMain.IsMain = false;
            photo.IsMain = true;

            if (await userRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Problem setting main photo.");
        }
    }
}
