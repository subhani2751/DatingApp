using DatingApp.Entities;
using DatingApp.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.Controllers
{
    [Authorize]
    public class MembersController(IMemberrepository memberrepository) : BaseApiController
    {
        [HttpGet("GetMembers")]
        public async Task<ActionResult<List<Member>>> GetMembers()
        {
            return Ok(await memberrepository.GetMembersAsync());
        }
        
        [HttpGet("{id}")]
        public async Task<ActionResult<Member>> GetMembers(string id)
        {
            var member = await memberrepository.GetMemberByIdAsync(id);
            if (member == null) return NotFound();
            return member;
        }
        [HttpGet("{id}/photos")]
        public async Task<ActionResult<List<Photo>>> GetMemberPhotos(string id)
        {
            return Ok(await memberrepository.GetPhotosForMemberAsync(id));
        }
    }
}
