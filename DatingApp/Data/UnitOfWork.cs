using DatingApp.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.Data
{
    public class UnitOfWork(AppDbContext context) : IUnitOfWork
    {
        private  IMemberrepository? _memberrepository;
        private IMessageRepository? _messageRepository;
        private ILikesRepository? _likesRepository;
        public IMemberrepository memberrepository => _memberrepository ??= new MemberRepository(context);

        public IMessageRepository messageRepository => _messageRepository ??= new MessageRepository(context);

        public ILikesRepository likesRepository => _likesRepository ??= new LikesRepository(context);

        public async Task<bool> Complete()
        {
            try
            {
                return await context.SaveChangesAsync() > 0;
            }
            catch (DbUpdateException ex)
            {
                throw new Exception("An error occured while saving changes", ex);
            }
        }

        public bool HasChanges()
        {
            return context.ChangeTracker.HasChanges();
        }
    }
}
