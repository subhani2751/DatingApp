using DatingApp.Entities;
using DatingApp.Helpers;

namespace DatingApp.Interfaces
{
    public interface ILikesRepository
    {
        Task<MemberLike?> GetMemberLike(string sourceMemberId, string targetMemberId);
        Task<PaginatedResult<Member>> GetMemberLikes(LikesParams likesParams);
        Task<IReadOnlyList<string>> GetcurrentMemberLikeIds(string memberId);
        void AddLike(MemberLike memberLike);
        void DeleteLike(MemberLike memberLike);
        Task<bool> SaveAllChanges();
    }
}
