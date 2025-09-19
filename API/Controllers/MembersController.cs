using API.Context;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class MembersController : BaseApiController
    {
        private readonly AppDbContext _context;
        public MembersController(AppDbContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<IActionResult> GetMembers()
        {
            var model = await _context.Users.ToListAsync();
            return Ok(model);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetMemberById(Guid id)
        {
            var model = await _context.Users.Where(x => x.Id == id).FirstOrDefaultAsync();
            if (model == null)
            {
                return NotFound();
            }
            return Ok(model);
        }
        [HttpPost("InsertUser")]
        public async Task<IActionResult> InsertUser(AppUser user)
        {
            var query = await _context.AddAsync(user);
            await _context.SaveChangesAsync();
            return Ok(query);
        }
        [HttpPut]
        public async Task<IActionResult> UpdateUser(AppUser user)
        {
            var data = await _context.Users.Where(x => x.Id == user.Id).FirstOrDefaultAsync();
            if (data == null)
            {
                return BadRequest("User not found");
            }
            _context.Entry(user).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return Ok(user);
        }
        [HttpDelete]
        public async Task<bool> DeleteUser(Guid id)
        {
            var model = await _context.Users.FindAsync(id);
            if (model == null)
            {
                return false;
            }
            _context.Users.Remove(model);
            int result = await _context.SaveChangesAsync();
            return result > 0;
        }
    }
}
