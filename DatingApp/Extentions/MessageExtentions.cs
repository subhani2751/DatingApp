using DatingApp.DTOs;
using DatingApp.Entities;
using System.Linq.Expressions;

namespace DatingApp.Extentions
{
    public static class MessageExtentions
    {
        public static MessageDTO ToDTO(this Message message)
        {
            return new MessageDTO
            {
                Id = message.Id,
                SenderId = message.SenderId,
                SenderDisplayName = message.Sender.sDisplayName,
                SenderImageUrl = message.Sender.sImageUrl,
                RecipientId = message.RecipientId,
                RecipientDisplayName = message.Recipient.sDisplayName,
                RecipientImageUrl = message.Recipient.sImageUrl,
                Content = message.Content,
                DateRead = message.DateRead,
                MessageSent = message.MessageSent,
            };
        }

        public static Expression<Func<Message, MessageDTO>> ToDTOProjection()
        {
            return message => new MessageDTO
            {
                Id = message.Id,
                SenderId = message.SenderId,
                SenderDisplayName = message.Sender.sDisplayName,
                SenderImageUrl = message.Sender.sImageUrl,
                RecipientId = message.RecipientId,
                RecipientDisplayName = message.Recipient.sDisplayName,
                RecipientImageUrl = message.Recipient.sImageUrl,
                Content = message.Content,
                DateRead = message.DateRead,
                MessageSent = message.MessageSent,
            };
        }
    }
}
