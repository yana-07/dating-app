using API.DTOs;
using API.Entities;
using API.Extensions;
using AutoMapper;

namespace API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<AppUser, MemberDto>()
                .ForMember(dest => dest.Age, opt => 
                    opt.MapFrom(src => src.DateOfBirth.CalculateAge()))
                .ForMember(dest => dest.PhotoUrl, opt => 
                    opt.MapFrom(src => src.Photos.FirstOrDefault(x => x.IsMain)!.Url)); // Ok to use the null-forgiving operator, if FirstOrDefault returns null, it will be propagated to the PhotoUrl and no NullReferenceException will be thrown
            CreateMap<Photo, PhotoDto>();
        }
    }
}
