using DatingApp.Data;
using DatingApp.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MembersController(AppDbContext Context) : ControllerBase
    {
        [HttpGet("GetMembers")]
        public async Task<ActionResult<List<AppUser>>> GetMembers()
        {
            var member = await Context.users.ToListAsync();
            return member;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AppUser>> GetMembers(string id)
        {
            var member = await Context.users.FindAsync(id);
            if (member == null) return NotFound();
            return member;
        }
    }
}
