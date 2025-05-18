﻿using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class UserRepository(DataContext context, IMapper mapper) : IUserRepository
    {
        public async Task<MemberDto?> GetMemberByUsernameAsync(string username)
        {
            return await context.Users
                .Where(x => x.UserName == username)
                .ProjectTo<MemberDto>(mapper.ConfigurationProvider)
                .SingleOrDefaultAsync();
        }

        public async Task<PagedList<MemberDto>> GetMembersAsync(PaginationParams paginationParams)
        {
            var query = context.Users.ProjectTo<MemberDto>(mapper.ConfigurationProvider);

            return await PagedList<MemberDto>.CreateAsync(query,
                paginationParams.PageNumber, paginationParams.PageSize);
        }

        public async Task<AppUser?> GetUserByIdAsync(int id)
        {
            return await context.Users.FindAsync(id);
        }

        public async Task<AppUser?> GetUserByUsernameAsync(string username)
        {
            // Use SingleOrDefaultAsync safely since usernames are unique in the DB
            return await context.Users
                .Include(u => u.Photos)
                .SingleOrDefaultAsync(u => u.UserName == username);
        }

        public async Task<IEnumerable<AppUser>> GetUsersAsync()
        {
            return await context.Users
                .Include(u => u.Photos)
                .ToListAsync();
        }

        public async Task<bool> SaveAllAsync()
        {
            return await context.SaveChangesAsync() > 0;
        }

        public void Update(AppUser user)
        {
            context.Entry(user).State = EntityState.Modified;
        }
    }
}
