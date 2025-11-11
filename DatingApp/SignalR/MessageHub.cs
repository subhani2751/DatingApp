using DatingApp.Data;
using DatingApp.DTOs;
using DatingApp.Entities;
using DatingApp.Extentions;
using DatingApp.Interfaces;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Primitives;
using System.Text.RegularExpressions;

namespace DatingApp.SignalR
{
    public class MessageHub(IMessageRepository messageRepository, IMemberrepository memberrepository) : Hub
    {
        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var otherUser = httpContext?.Request.Query["userId"].ToString() ?? throw new HubException("other user not found in query string");
            var groupName = GetGroupName(GetUserId(), otherUser);
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            var messages = await messageRepository.GetMessageThreadAsync(GetUserId(), otherUser);

            await Clients.Group(groupName).SendAsync("ReceiveMessagesThread", messages);    
        }

        public async Task SendMessage(CreateMessageDTO createMessageDTO)
        {
            var sender = await memberrepository.GetMemberByIdAsync(GetUserId());
            var recipient = await memberrepository.GetMemberByIdAsync(createMessageDTO.RecipientId);

            if (recipient == null || sender == null || sender.sID == createMessageDTO.RecipientId)
            {
                throw new HubException("Cannot not send message");
            }

            var message = new Message
            {
                SenderId = sender.sID,
                RecipientId = recipient.sID,
                Content = createMessageDTO.Content
            };
            messageRepository.AddMessage(message);
            if (await messageRepository.SaveAllAsync())
            {
               var groupName = GetGroupName(sender.sID, recipient.sID);
                await Clients.Group(groupName).SendAsync("NewMessage", message.ToDTO());
            }
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            return base.OnDisconnectedAsync(exception);
        }

        private static string GetGroupName(string? caller, string? other)
        {
            var stringCompare = string.CompareOrdinal(caller, other) < 0;
            return stringCompare ? $"{caller}-{other}" : $"{other}-{caller}";
        }

        private string GetUserId()
        {
            return Context.User?.GetMemberId() ?? throw new HubException("User ID not found in context");
        }
    }
}
