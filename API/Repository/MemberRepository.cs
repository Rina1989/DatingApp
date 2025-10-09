using API.Context;
using API.Entities;
using API.Helpers;
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
    public async Task<PaginatedResult<Member>> GetMemberAsync(MemberParams memberParams)
    {
        var query = _context.Members.AsQueryable();

        query = query.Where(x => x.Id != memberParams.CurrentMemberId);

        if (memberParams.Gender != null)
        {
            query = query.Where(x => x.Gender == memberParams.Gender);
        }

        var minDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-memberParams.MaxAge - 1));
        var maxDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-memberParams.MinAge));

        query = query.Where(x => x.DateOfBirth >= minDob && x.DateOfBirth <= maxDob);

        query = memberParams.OrderBy switch
        {
            "created" => query.OrderByDescending(x => x.Created),
            _ => query.OrderByDescending(x => x.LastActive)
        };

        return await PaginationHelper.CreatedAsync(query, memberParams.pageNumber, memberParams.PageSize);
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
