using DatingApp.Entities;
using DatingApp.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.Data
{
    public class MemberRepository(AppDbContext Context) : IMemberrepository
    {
        public async Task<Member?> GetMemberByIdAsync(string id)
        {
            return await Context.Members.FindAsync(id);
        }

        public async Task<IReadOnlyList<Member>> GetMembersAsync()
        {
            return await Context.Members.ToListAsync();
        }

        public async Task<IReadOnlyList<Photo>> GetPhotosForMemberAsync(string memberId)
        {
            return await Context.Members.Where(u => u.sID == memberId)
                                      .SelectMany(x => x.Photos)
                                      .ToListAsync();
        }

        public async Task<bool> SaveAllAsync()
        {
            return await Context.SaveChangesAsync() > 0;
        }

        public async void Update(Member member)
        {
            Context.Entry(member).State = EntityState.Modified;
        }
    }
}
