﻿using API.Entities;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace API.Data
{
    public static class Seeder
    {
        public static async Task SeedUsersAsync(DataContext context, IWebHostEnvironment env)
        {
            if (await context.Users.AnyAsync()) return;

            var userData = await File.ReadAllTextAsync(Path.Combine(env.ContentRootPath, "Data/UserSeedData.json"));

            var options = new JsonSerializerOptions {PropertyNameCaseInsensitive = true};

            var users = JsonSerializer.Deserialize<List<AppUser>>(userData, options);

            if (users == null) return;

            foreach (var user in users)
            {
                using var hmac = new HMACSHA512();

                user.UserName = user.UserName.ToLower();
                user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("Pa$$w0rd"));
                user.PasswordSalt = hmac.Key;

                context.Users.Add(user);
            }

            await context.SaveChangesAsync();
        }
    }
}
