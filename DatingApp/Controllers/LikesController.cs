using DatingApp.Entities;
using DatingApp.Extentions;
using DatingApp.Helpers;
using DatingApp.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.Controllers
{

    public class LikesController(IUnitOfWork uow) : BaseApiController
    {
        [HttpPost("{targetMemberId}")]
        public async Task<ActionResult> ToggleLike(string targetMemberId)
        {
            var sourceMemberId = User.GetMemberId();
            if (sourceMemberId == targetMemberId)
                return BadRequest("You cannot like yourself.");
            var existingLike = await uow.likesRepository.GetMemberLike(sourceMemberId, targetMemberId);
            //if (existingLike != null)
            //    return BadRequest("You have already liked this member.");
            if(existingLike == null)
            {
                var Likes = new MemberLike
                {
                    SourceMemberId = sourceMemberId,
                    TargetMemberId = targetMemberId
                };
                uow.likesRepository.AddLike(Likes);
            }
            else
            {
                uow.likesRepository.DeleteLike(existingLike);
            }
            if (await uow.Complete())
                return Ok();
            return BadRequest("Failed to like member.");
        }
        [HttpGet("list")]
        public async Task<ActionResult<IEnumerable<string>>> GetcurrentMemberLikeIds()
        {
            var memberId = User.GetMemberId();
            var members = await uow.likesRepository.GetcurrentMemberLikeIds(memberId);
            return Ok(members);
        }
        [HttpGet("GetMemberLikes")]
        public async Task<ActionResult<IEnumerable<Member>>> GetMemberLikes([FromQuery] LikesParams likesParams)
        {
            likesParams.memberId = User.GetMemberId();
            var members = await uow.likesRepository.GetMemberLikes(likesParams);
            return Ok(members);
        }
    }
}
