using System;
using API.Entities;
using API.Extension;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class LikesController : BaseApiController
{
    private readonly ILikesRepository _likesRepository;
    public LikesController(ILikesRepository likesRepository)
    {
        _likesRepository = likesRepository;
    }
    [HttpPost("{targetMemberId}")]
    public async Task<ActionResult> ToggleLike(string targetMemberId)
    {
        var sourceMemberId = User.GetMemberId();
        if (sourceMemberId == targetMemberId) return BadRequest("You cannot like yourself");
        var existingLike = await _likesRepository.GetMemberLike(sourceMemberId, targetMemberId);
        if (existingLike == null)
        {
            var like = new MemberLike
            {
                SourceMemberId = sourceMemberId,
                TargerMemberId = targetMemberId
            };

            _likesRepository.AddLike(like);
        }
        else
        {
            _likesRepository.DeleteLike(existingLike);
        }
        if (await _likesRepository.SaveAllChanges()) return Ok();

        return BadRequest("Failed to update like");
    }

    [HttpGet("list")]
    public async Task<ActionResult<IEnumerable<string>>> GetCurrentMemberLikeIds()
    {
        return Ok(await _likesRepository.GetCurrentMembersLikesIds(User.GetMemberId()));
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Member>>> GetMemberLikes(string predicate)
    {
        var members = await _likesRepository.GetMembersLikes(predicate, User.GetMemberId());
        return Ok(members);
  }

}
