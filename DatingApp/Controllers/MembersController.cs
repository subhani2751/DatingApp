using DatingApp.DTOs;
using DatingApp.Entities;
using DatingApp.Extentions;
using DatingApp.Helpers;
using DatingApp.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace DatingApp.Controllers
{
    [Authorize]
    public class MembersController(IUnitOfWork uow,IPhotoService photoService) : BaseApiController
    {
        [HttpGet("GetMembers")]
        public async Task<ActionResult<List<Member>>> GetMembers([FromQuery]MemberParams memberParams)
        {
            memberParams.CurrentMemberId = User.GetMemberId();
            return Ok(await uow.memberrepository.GetMembersAsync(memberParams));
        }
        
        [HttpGet("{id}")]
        public async Task<ActionResult<Member>> GetMembers(string id)
        {
            var member = await uow.memberrepository.GetMemberByIdAsync(id);
            if (member == null) return NotFound();
            return member;
        }
        [HttpGet("{id}/photos")]
        public async Task<ActionResult<List<Photo>>> GetMemberPhotos(string id)
        {
            return Ok(await uow.memberrepository.GetPhotosForMemberAsync(id));
        }
        [HttpPut("UpdateMember")]
        public async Task<ActionResult> UpdateMember(MemberUpdateDTO memberUpdateDTO)
        {
            //var memberId = User.FindFirstValue("sId");
            //if (memberId == null) return BadRequest("Oops - no id found in token");

            var memberId = User.GetMemberId();
            var member = await uow.memberrepository.GetMemberForUpdateAsync(memberId);
            if (member == null) return BadRequest("Could not get member");

            member.sDisplayName = memberUpdateDTO.sDisplayName ?? member.sDisplayName;
            member.sDescription = memberUpdateDTO.sDescription ?? member.sDescription;
            member.sCity = memberUpdateDTO.sCity ?? member.sCity;
            member.sCountry = memberUpdateDTO.sCountry ?? member.sCountry;

            member.user.sDisplayName = memberUpdateDTO.sDisplayName ?? member.user.sDisplayName;

            uow.memberrepository.Update(member);
            if(await uow.Complete()) return NoContent();

            return BadRequest("Failed to update member");
        }

        [HttpPost("add-photo")]
        public async Task<ActionResult<Photo>> AddPhoto([FromForm]IFormFile file)
        {
            var member = await uow.memberrepository.GetMemberForUpdateAsync(User.GetMemberId());
            if (member == null) return BadRequest("Can not update member");
            var uploadResult = await photoService.UploadPhotoAsync(file);
            if (uploadResult.Error != null) return BadRequest(uploadResult.Error.Message);
            var photo=new Photo
            {
                sUrl = uploadResult.SecureUrl.AbsoluteUri,
                sPublicId = uploadResult.PublicId,
                memberId = User.GetMemberId()
            };
            if(member.sImageUrl == null)
            {
                member.sImageUrl = photo.sUrl;
                member.user.sImageUrl = photo.sUrl;
            }
            member.Photos.Add(photo);
            if (await uow.Complete()) return photo;
            
            return BadRequest("Problem adding photo");
        }
        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int photoId)
        {
            var member = await uow.memberrepository.GetMemberForUpdateAsync(User.GetMemberId());

            if(member == null) return BadRequest("Could not get member");

            var photo = member.Photos.FirstOrDefault(x => x.sId == photoId);

            if (member.sImageUrl == photo?.sUrl || photo == null) return BadRequest("Cannot set this as a main image");

            member.sImageUrl = photo.sUrl;
            member.user.sImageUrl = photo.sUrl;

            if (await uow.Complete()) return NoContent();

            return BadRequest("Failed to set main photo");
        }
        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            var member = await uow.memberrepository.GetMemberForUpdateAsync(User.GetMemberId());

            if (member == null) return BadRequest("Could not get member");

            var photo = member.Photos.FirstOrDefault(x => x.sId == photoId);

            if(member.sImageUrl == photo?.sUrl || photo == null) return BadRequest("This photo cannot be deleted");

            if(photo.sPublicId != null)
            {
                var result = await photoService.DeletePhotoAsync(photo.sPublicId);
                if (result.Error != null) return BadRequest(result.Error.Message);
            }

            member.Photos.Remove(photo);

            if (await uow.Complete()) return Ok();

            return BadRequest("problem deleting the photo");
        }
    }
}
