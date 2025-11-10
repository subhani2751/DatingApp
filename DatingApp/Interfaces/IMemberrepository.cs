using DatingApp.Entities;
using DatingApp.Helpers;

namespace DatingApp.Interfaces
{
    public interface IMemberrepository
    {
        void Update(Member member);
        Task<bool> SaveAllAsync();
        Task<PaginatedResult<Member>> GetMembersAsync(MemberParams memberParams);
        Task<Member?> GetMemberByIdAsync(string id);
        Task<IReadOnlyList<Photo>> GetPhotosForMemberAsync(string memberId);
        Task<Member?> GetMemberForUpdateAsync(string id);
    }
}
