using DatingApp.Entities;

namespace DatingApp.Interfaces
{
    public interface IMemberrepository
    {
        void Update(Member member);
        Task<bool> SaveAllAsync();
        Task<IReadOnlyList<Member>> GetMembersAsync();
        Task<Member?> GetMemberByIdAsync(string id);
        Task<IReadOnlyList<Photo>> GetPhotosForMemberAsync(string memberId);
    }
}
