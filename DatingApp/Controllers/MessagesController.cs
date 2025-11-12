using DatingApp.DTOs;
using DatingApp.Entities;
using DatingApp.Extentions;
using DatingApp.Helpers;
using DatingApp.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.Controllers
{
    public class MessagesController (IMessageRepository messageRepository, IMemberrepository memberrepository): BaseApiController
    {
        [HttpPost("CreateMessage")]
        public async Task<ActionResult<MessageDTO>> CreateMessage(CreateMessageDTO createMessageDTO)
        {
            var sender = await memberrepository.GetMemberByIdAsync(User.GetMemberId());
            var recipient = await memberrepository.GetMemberByIdAsync(createMessageDTO.RecipientId);

            if (recipient == null || sender == null || sender.sID == createMessageDTO.RecipientId)
            {
                return BadRequest("Could not send this message");
            }

            var message = new Message
            {
                SenderId = sender.sID,
                RecipientId = recipient.sID,
                Content = createMessageDTO.Content
            };
            messageRepository.AddMessage(message);
            if(await messageRepository.SaveAllAsync())
            {
                return Ok(message.ToDTO());
            }
            return BadRequest("Failed to sent message");
        }
        [HttpGet("GetMessagesByContainer")]
        public async Task<ActionResult<PaginatedResult<MessageDTO>>> GetMessagesByContainer([FromQuery] MessageParams messageParams)
        {
            messageParams.MemberId = User.GetMemberId();
            return await messageRepository.GetMessagesForMember(messageParams);
        }
        [HttpGet("thread/{recipientId}")]
        public async Task<ActionResult<IReadOnlyList<MessageDTO>>> GetMessageThread(string recipientID)
        {
            return Ok(await messageRepository.GetMessageThreadAsync(User.GetMemberId(), recipientID));
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMessage(string id)
        {
            var memberId = User.GetMemberId();
            var message = await messageRepository.GetMessage(id);
            if(message == null) return BadRequest("Cannot delete this message");
            if(message.SenderId != memberId && message.RecipientId != memberId)
            {
                return BadRequest("You cannot delete this message");
            }
            if(message.SenderId == memberId) message.SenderDeleted = true;
            if(message.RecipientId == memberId) message.RecipientDeleted = true;
            if (message is { SenderDeleted: true, RecipientDeleted: true }) 
            {
                messageRepository.DeleteMessage(message);
            }
            if(await messageRepository.SaveAllAsync()) return Ok();
            return BadRequest("Problem Deleting the Message");
        }
    }
}
