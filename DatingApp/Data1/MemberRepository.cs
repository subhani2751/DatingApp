using DatingApp.Entities;
using DatingApp.Helpers;
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
        public async Task<Member?> GetMemberForUpdateAsync(string id)
        {
            return await Context.Members
                .Include(a => a.user)
                .Include(a => a.Photos)
                .FirstOrDefaultAsync(x => x.sID == id);

        }

        public async Task<PaginatedResult<Member>> GetMembersAsync(MemberParams memberParams)
        {
            var query =Context.Members.AsQueryable();
            query = query.Where(x => x.sID != memberParams.CurrentMemberId);
            if(memberParams.Gender != null)
            {
                query = query.Where(x => x.sGender == memberParams.Gender);
            }
            var minDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-memberParams.MaxAge - 1));
            var maxDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-memberParams.MinAge));
            query = query.Where(x => x.DateOfBirth >= minDob && x.DateOfBirth <= maxDob);
            query = memberParams.OrderBy switch
            {
                "created" => query.OrderByDescending(x => x.Created),
                _ => query.OrderByDescending(x => x.LastActive)
            };

            return await PaginationHelper.CreateAsync(query, memberParams.pageNumber, memberParams.PageSize);
        }

        public async Task<IReadOnlyList<Photo>> GetPhotosForMemberAsync(string memberId)
        {
            return await Context.Members.Where(u => u.sID == memberId)
                                      .SelectMany(x => x.Photos)
                                      .ToListAsync();
        }

        public void Update(Member member)
        {
            Context.Entry(member).State = EntityState.Modified;
        }
    }
}
