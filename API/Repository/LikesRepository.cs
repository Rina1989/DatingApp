using System;
using API.Context;
using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Repository;

public class LikesRepository : ILikesRepository
{
    private readonly AppDbContext _context;
    public LikesRepository(AppDbContext context)
    {
        _context = context;
    }
    public void AddLike(MemberLike like)
    {
        _context.Likes.Add(like);
    }

    public void DeleteLike(MemberLike like)
    {
        _context.Likes.Remove(like);
    }

    public async Task<IReadOnlyList<string>> GetCurrentMembersLikesIds(string memberId)
    {
        return await _context.Likes.Where(x => x.SourceMemberId == memberId)
        .Select(x => x.TargerMemberId)
        .ToListAsync();
    }

    public async Task<MemberLike?> GetMemberLike(string sourceMemberId, string targerMemberId)
    {
        return await _context.Likes.FindAsync(sourceMemberId, targerMemberId);
    }

    public async Task<IReadOnlyList<Member>> GetMembersLikes(string predicate, string memberId)
    {
        var query = _context.Likes.AsQueryable();
        switch (predicate)
        {
            case "liked":
                return await query.Where(x => x.SourceMemberId == memberId).Select(x => x.TargetMember).ToListAsync();
            case "likedBy":
                return await query.Where(x => x.TargerMemberId == memberId).Select(x => x.SourceMember).ToListAsync();
            default: //Mutual
                var likeIds = await GetCurrentMembersLikesIds(memberId);

                return await query
                 .Where(x => x.TargerMemberId == memberId && likeIds.Contains(x.SourceMemberId))
                 .Select(x => x.SourceMember).ToListAsync();
  }
    }

    public async Task<bool> SaveAllChanges()
    {
        return await _context.SaveChangesAsync() > 0;
    }
}
