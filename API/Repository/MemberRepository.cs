using API.Context;
using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Repository;

public class MemberRepository : IMemberRepository
{
    private readonly AppDbContext _context;
    public MemberRepository(AppDbContext context)
    {
        _context = context;
    }
    public async Task<IReadOnlyList<Member>> GetMemberAsync()
    {
        return await _context.Members
        // .Include(x=>x.photos)
        .ToListAsync();
    }

    public async Task<Member?> GetMemberByIdAsync(string id)
    {
        return await _context.Members.FindAsync(id);
    }

    public async Task<Member?> GetMemberForUpdate(string id)
    {
        return await _context.Members
        .Include(x => x.user)
        .Include(x=>x.photos)
        .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<IReadOnlyList<Photo>> GetPhotosForMemberAsync(string memberId)
    {
        return await _context.Members.Where(x => x.Id == memberId)
        .SelectMany(x => x.photos)
        .ToListAsync();
    }

    public async Task<bool> SaveAllAsync()
    {   
        return await _context.SaveChangesAsync() > 0;
    }

    public void Update(Member member)
    {
        _context.Entry(member).State = EntityState.Modified;
    }
}
