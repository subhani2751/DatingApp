namespace DatingApp.Interfaces
{
    public interface IUnitOfWork
    {
        IMemberrepository memberrepository { get; }
        IMessageRepository  messageRepository { get; }
        ILikesRepository likesRepository { get; }
        Task<bool> Complete();
        bool HasChanges();
    }
}
