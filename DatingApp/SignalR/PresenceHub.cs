using DatingApp.Extentions;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace DatingApp.SignalR
{
    public class PresenceHub(PresenceTracker presenceTracker) : Hub
    {
        public override async Task OnConnectedAsync()
        {
            await presenceTracker.UserConnected(GetUserId(), Context.ConnectionId);
            await Clients.Others.SendAsync("UserOnline", GetUserId());

            var cuurentUsers = await presenceTracker.GetOnlineUsers();
            await Clients.Caller.SendAsync("GetOnlineUsers", cuurentUsers);
            //await base.OnConnectedAsync();
        }
        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            await presenceTracker.UserDisconnected(GetUserId(), Context.ConnectionId);
            await Clients.Others.SendAsync("UserOffline", GetUserId());

            var cuurentUsers = await presenceTracker.GetOnlineUsers();
            await Clients.Caller.SendAsync("GetOnlineUsers", cuurentUsers);

            await base.OnDisconnectedAsync(exception);
        }
        private string GetUserId()
        {
            return Context.User?.GetMemberId() ?? throw new HubException("User ID not found in context");
        }
    }
}
