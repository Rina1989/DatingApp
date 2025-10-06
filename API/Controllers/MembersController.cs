using System.Security.Claims;
using API.DTOs;
using API.Entities;
using API.Extension;
using API.Interfaces;
using API.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class MembersController : BaseApiController
    {
        private readonly IMemberRepository _memberRepository;
        private readonly IPhotoService _photoService;
        public MembersController(IMemberRepository memberRepository, IPhotoService photoService)
        {
            _memberRepository = memberRepository;
            _photoService = photoService;
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

        [HttpPost("add-photo")]
        public async Task<ActionResult<Photo>> AddPhoto([FromForm] IFormFile file)
        {
            var member = await _memberRepository.GetMemberForUpdate(User.GetMemberId());
            if (member == null) return BadRequest("Cannot update member");
            var result = await _photoService.UploadPhotoAsync(file);
            if (result.Error != null)
                return BadRequest(result.Error.Message);
            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId,
                MemberId = User.GetMemberId()
            };
            if (member.ImageUrl == null)
            {
                member.ImageUrl = photo.Url;
                member.user.ImageUrl = photo.Url;
            }
            member.photos.Add(photo);
            if (await _memberRepository.SaveAllAsync()) return photo;
            return BadRequest("Problem adding photo");
        }

        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int photoId)
        {
            var member = await _memberRepository.GetMemberForUpdate(User.GetMemberId());
            if (member == null) return BadRequest("Cannot get member from tokn");
            var photo = member.photos.SingleOrDefault(x => x.Id == photoId);
            if (member.ImageUrl == photo?.Url || photo == null)
            {
                return BadRequest("Cannot set this an main image");
            }
            member.ImageUrl = photo.Url;
            member.user.ImageUrl = photo.Url;
            if (await _memberRepository.SaveAllAsync())
                return NoContent();
            return BadRequest("Problem setting main photo");
        }

        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            var member = await _memberRepository.GetMemberForUpdate(User.GetMemberId());
            if (member == null) return BadRequest("Cannot get member from tokn");
            var photo = member.photos.SingleOrDefault(x => x.Id == photoId);
            if (photo == null || photo.Url == member.ImageUrl)
            {
                return BadRequest("This photo cannot be deleted");
            }
            if (photo.PublicId != null)
            {
                var result = await _photoService.DeletePhotoAsync(photo.PublicId);
                if (result.Error != null) return BadRequest(result.Error.Message);
            }
            member.photos.Remove(photo);
            if (await _memberRepository.SaveAllAsync()) return Ok();
            return BadRequest("Problem deleting the photo");
        }
    }
    // [HttpDelete]
    // public async Task<bttool> DeleteUser(string id)
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

