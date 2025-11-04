using DatingApp.DTOs;
using DatingApp.Entities;
using DatingApp.Extentions;
using DatingApp.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

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
        [HttpPut("UpdateMember")]
        public async Task<ActionResult> UpdateMember(MemberUpdateDTO memberUpdateDTO)
        {
            //var memberId = User.FindFirstValue("sId");
            //if (memberId == null) return BadRequest("Oops - no id found in token");

            var memberId = User.GetMemberId();
            var member = await memberrepository.GetMemberForUpdateAsync(memberId);
            if (member == null) return BadRequest("Could not get member");

            member.sDisplayName = memberUpdateDTO.sDisplayName ?? member.sDisplayName;
            member.sDescription = memberUpdateDTO.sDescription ?? member.sDescription;
            member.sCity = memberUpdateDTO.sCity ?? member.sCity;
            member.sCountry = memberUpdateDTO.sCountry ?? member.sCountry;

            member.user.sDisplayName = memberUpdateDTO.sDisplayName ?? member.user.sDisplayName;

            memberrepository.Update(member);
            if(await memberrepository.SaveAllAsync()) return NoContent();

            return BadRequest("Failed to update member");
        }
    }
}
