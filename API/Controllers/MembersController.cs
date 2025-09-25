using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
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
        [HttpGet("{id}/photo")]
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
        // [HttpPut]
        // public async Task<IActionResult> UpdateUser(AppUser user)
        // {
        //     var data = await _memberRepository.Update(user);
        //     if (data == null)
        //     {
        //         return BadRequest("User not found");
        //     }
        //     _context.Entry(user).State = EntityState.Modified;
        //     await _context.SaveChangesAsync();
        //     return Ok(user);
        // }
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
