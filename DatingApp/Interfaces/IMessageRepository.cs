using DatingApp.DTOs;
using DatingApp.Entities;
using DatingApp.Helpers;

namespace DatingApp.Interfaces
{
    public interface IMessageRepository
    {
        void AddMessage(Message message);
        void DeleteMessage(Message message);
        Task<Message?> GetMessageBy(string id);
        Task<PaginatedResult<MessageDTO>> GetMessagesForMember(MessageParams messageParams);
        Task<IReadOnlyList<MessageDTO>> GetMessageThreadAsync(string currentMemberId, string recipientId);
        Task<bool> SaveAllAsync();
    }
}
