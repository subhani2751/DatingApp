using DatingApp.DTOs;
using DatingApp.Entities;
using DatingApp.Extentions;
using DatingApp.Helpers;
using DatingApp.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.Data
{
    public class MessageRepository(AppDbContext context) : IMessageRepository
    {
        public void AddGroup(Group group)
        {
            context.Groups.Add(group);
        }

        public void AddMessage(Message message)
        {
            context.Messages.Add(message);
        }

        public void DeleteMessage(Message message)
        {
            context.Messages.Remove(message);
        }

        public async Task<Connection?> GetConnection(string connectionId)
        {
            return await context.Connections.FindAsync(connectionId);
        }

        public async Task<Group?> GetGroupForConnection(string connectionId)
        {
            return await context.Groups
                .Include(g => g.Connections)
                .Where(g => g.Connections.Any(c => c.ConnectionId == connectionId))
                .FirstOrDefaultAsync();
        }

        public async Task<Message?> GetMessage(string id)
        {
            return await context.Messages.FindAsync(id);
        }

        public async Task<Group?> GetMessageGroup(string groupName)
        {
            return await context.Groups
                .Include(g => g.Connections)
                .FirstOrDefaultAsync(g => g.Name == groupName);
        }

        public async Task<PaginatedResult<MessageDTO>> GetMessagesForMember(MessageParams messageParams)
        {
            var query = context.Messages
                        .OrderByDescending(m => m.MessageSent)
                        .AsQueryable();
            query = messageParams.Container switch
            {
                "Outbox" => query.Where(m => m.SenderId == messageParams.MemberId && m.SenderDeleted == false),
                _ => query.Where(m => m.RecipientId == messageParams.MemberId && m.RecipientDeleted == false)
            };

            var messagesQuery = query.Select(MessageExtentions.ToDTOProjection());

            return await PaginationHelper.CreateAsync(messagesQuery, messageParams.pageNumber, messageParams.PageSize);
        }

        public async Task<IReadOnlyList<MessageDTO>> GetMessageThreadAsync(string currentMemberId, string recipientId)
        {
            await context.Messages
                .Where(m => m.RecipientId == currentMemberId && m.SenderId == recipientId && m.DateRead == null)
                .ExecuteUpdateAsync(setters => setters.SetProperty(x => x.DateRead, DateTime.UtcNow));
            return await context.Messages
                .Where(m => (m.RecipientId == currentMemberId && m.RecipientDeleted == false && m.SenderId == recipientId) || (m.SenderId == currentMemberId && m.SenderDeleted == false && m.RecipientId == recipientId))
                .OrderBy(x => x.MessageSent)
                .Select(MessageExtentions.ToDTOProjection())
                .ToListAsync();
        }

        public async Task RemoveConnection(string connectionId)
        {
             await context.Connections
                .Where(c => c.ConnectionId == connectionId)
                .ExecuteDeleteAsync();
        }

        public async Task<bool> SaveAllAsync()
        {
            return await context.SaveChangesAsync() > 0;
        }
    }
}
