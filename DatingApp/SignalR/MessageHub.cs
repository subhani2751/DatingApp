using DatingApp.DTOs;
using DatingApp.Entities;
using DatingApp.Extentions;
using DatingApp.Interfaces;
using Microsoft.AspNetCore.SignalR;

namespace DatingApp.SignalR
{
    public class MessageHub(IMessageRepository messageRepository, IMemberrepository memberrepository,IHubContext<PresenceHub> presenceHub) : Hub
    {
        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var otherUser = httpContext?.Request.Query["userId"].ToString() ?? throw new HubException("other user not found in query string");
            var groupName = GetGroupName(GetUserId(), otherUser);
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            await AddToGroup(groupName);
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

            var groupName = GetGroupName(sender.sID, recipient.sID);
            var group =  await messageRepository.GetMessageGroup(groupName);
            var userInGroup = group != null && group.Connections.Any(x => x.UserId == message.RecipientId);
            if (userInGroup)
            {
                message.DateRead = DateTime.UtcNow;
            }

            messageRepository.AddMessage(message);
            if (await messageRepository.SaveAllAsync())
            {
                await Clients.Group(groupName).SendAsync("NewMessage", message.ToDTO());
                var connections = await PresenceTracker.GetConnectionForUser(recipient.sID);
                if (connections != null && connections.Count > 0 && !userInGroup) 
                {
                    await presenceHub.Clients.Clients(connections).SendAsync("NewMessageReceived", message.ToDTO());
                }
            }
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            await messageRepository.RemoveConnection(Context.ConnectionId);
            await base.OnDisconnectedAsync(exception);
        }

        private async Task<bool> AddToGroup(string groupName)
        {
            var group = await messageRepository.GetMessageGroup(groupName);
            var connection = new Connection(Context.ConnectionId, GetUserId());
            if(group == null)
            {
                group = new Group(groupName);
                messageRepository.AddGroup(group);
            }
            group.Connections.Add(connection);
            return await messageRepository.SaveAllAsync();
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
