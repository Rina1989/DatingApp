using System.Security.Claims;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class MembersController : BaseApiController
    {
        private readonly IMemberRepository _memberRepository;
        public MembersController(IMemberRepository memberRepository)
        {
            _memberRepository = memberRepository;
        }
        [HttpGet]
        public async Task<IActionResult> GetMembers()
        {
            return Ok(await _memberRepository.GetMemberAsync());
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetMemberById(string id)
        {
            var model = await _memberRepository.GetMemberByIdAsync(id);
            if (model == null)
            {
                return NotFound();
            }
            return Ok(model);
        }
        [HttpGet("{id}/photos")]
        public async Task<IActionResult> GetMemberPhotos(string id)
        {
            var model = await _memberRepository.GetPhotosForMemberAsync(id);
            if (model == null)
            {
                return NotFound();
            }
            return Ok(model);
        }
        // [HttpPost("InsertUser")]
        // public async Task<IActionResult> InsertUser(AppUser user)
        // {
        //     var query = await _context.AddAsync(user);
        //     await _context.SaveChangesAsync();
        //     return Ok(query);
        // }
        [HttpPut]
        public async Task<IActionResult> UpdateMember(MemberUpdateDTO memberUpdate)
        {
            var memberId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (memberId == null) return BadRequest("Oops - No Id found in token");

            var member = await _memberRepository.GetMemberForUpdate(memberId);
            if (member == null) return BadRequest("Could not get member");
            member.DisplayName = memberUpdate.DisplayName ?? member.DisplayName;
            member.Description = memberUpdate.Description ?? member.Description;
            member.City = memberUpdate.City ?? member.City;
            member.Country = memberUpdate.Country ?? member.Country;

            _memberRepository.Update(member);
            if (await _memberRepository.SaveAllAsync())
            {
                return NoContent();
            }
            return BadRequest("Failed to update member.");
        }
        // [HttpDelete]
        // public async Task<bool> DeleteUser(string id)
        // {
        //     var model = await _context.Users.FindAsync(id);
        //     if (model == null)
        //     {
        //         return false;
        //     }
        //     _context.Users.Remove(model);
        //     int result = await _context.SaveChangesAsync();
        //     return result > 0;
        // }
    }
}
