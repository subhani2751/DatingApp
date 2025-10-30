using DatingApp.Data;
using DatingApp.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.Controllers
{
    public class MembersController(AppDbContext Context) : BaseApiController
    {
        [HttpGet("GetMembers")]
        public async Task<ActionResult<List<AppUser>>> GetMembers()
        {
            var member = await Context.users.ToListAsync();
            return member;
        }
        //[Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<AppUser>> GetMembers(string id)
        {
            var member = await Context.users.FindAsync(id);
            if (member == null) return NotFound();
            return member;
        }
    }
}
