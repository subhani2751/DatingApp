using DatingApp.DTOs;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Security.Cryptography;
using DatingApp.Entities;
using System.Text;
using Microsoft.AspNetCore.Identity;

namespace DatingApp.Data
{
    public class Seed
    {
        public static async Task SeedUsers(UserManager<AppUser> userManager)
        {
            if (await userManager.Users.AnyAsync()) return;
            var userData = await File.ReadAllTextAsync("Data/UserSeedData.json");
            //var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var members = JsonSerializer.Deserialize<List<SeedUserDTO>>(userData);
            if (members == null)
            {
                Console.WriteLine("No user data found in the JSON file.");
                return;
            }
            foreach (var member in members)
            {
                //using var hmac = new HMACSHA512();
                var user = new AppUser
                {
                    sID = member.sID,
                    Id= member.sID,
                    sDisplayName = member.sDisplayName,
                    sEmail = member.sEmail,
                    Email = member.sEmail,
                    sImageUrl = member.sImageUrl,
                    UserName = member.sEmail,
                    //PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("Pa$$w0rd")),
                    //Passwordsalt = hmac.Key,
                    Member = new Member
                    {
                        sID = member.sID,
                        DateOfBirth = member.DateOfBirth,
                        sDisplayName = member.sDisplayName,
                        sGender = member.sGender,
                        sCity = member.sCity,
                        sCountry = member.sCountry,
                        sDescription = member.sDescription,
                        sImageUrl = member.sImageUrl,
                        Created = member.Created,
                        LastActive = member.LastActive
                    }
                };
                user.Member.Photos.Add(new Photo
                {
                    sUrl = member.sImageUrl!,
                    memberId = member.sID
                });
                var result = await userManager.CreateAsync(user, "Pa$$w0rd");
                if (!result.Succeeded)
                {
                    Console.WriteLine(result.Errors.First().Description);
                }
                await userManager.AddToRoleAsync(user, "Member");
            }
            var admin = new AppUser
            {
                UserName = "admin@test.com",
                sEmail = "admin@test.com",
                Email = "admin@test.com",
                sDisplayName = "Admin",
            };
            await userManager.CreateAsync(admin, "Pa$$w0rd");
            await userManager.AddToRolesAsync(admin, ["Admin", "Moderator"]);

        }
    }
}
