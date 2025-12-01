using DatingApp.Entities;
using DatingApp.Helpers;
using DatingApp.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.Data
{
    public class LikesRepository(AppDbContext context) : ILikesRepository
    {
        public void AddLike(MemberLike memberLike)
        {
            context.Likes.Add(memberLike);
        }

        public void DeleteLike(MemberLike memberLike)
        {
            context.Likes.Remove(memberLike);
        }

        public async Task<IReadOnlyList<string>> GetcurrentMemberLikeIds(string memberId)
        {
            return await context.Likes
                .Where(like => like.SourceMemberId == memberId)
                .Select(like => like.TargetMemberId)
                .ToListAsync();
        }

        public async Task<MemberLike?> GetMemberLike(string sourceMemberId, string targetMemberId)
        {
            return await context.Likes
                .FindAsync(sourceMemberId, targetMemberId);
        }

        public async Task<PaginatedResult<Member>> GetMemberLikes(LikesParams likesParams)
        {
            var query = context.Likes.AsQueryable();
            IQueryable<Member> result;
            switch(likesParams.predicate)
            {
                case "liked":
                    result= query
                        .Where(x => x.SourceMemberId == likesParams.memberId)
                        .Select(x => x.TargetMember);
                    break;
                case "likedBy":
                    result = query
                        .Where(x => x.TargetMemberId == likesParams.memberId)
                        .Select(x => x.SourceMember);
                    break;
                default:
                    var likeIds = await GetcurrentMemberLikeIds(likesParams.memberId);
                    result = query
                        .Where(x => x.TargetMemberId == likesParams.memberId && likeIds.Contains(x.SourceMemberId))
                        .Select(x=>x.SourceMember);
                    break;
            }
            return await PaginationHelper.CreateAsync(result,likesParams.pageNumber, likesParams.PageSize);
        }
    }
}
