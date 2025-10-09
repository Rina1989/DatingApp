using System;
using API.Entities;

namespace API.Interfaces;

public interface ILikesRepository
{
    Task<MemberLike?> GetMemberLike(string sourceMemberId, string targerMemberId);
    Task<IReadOnlyList<Member>> GetMembersLikes(string predicate, string memberId);
    Task<IReadOnlyList<string>> GetCurrentMembersLikesIds(string memberId);
    void DeleteLike(MemberLike like);
    void AddLike(MemberLike like);
    Task<bool> SaveAllChanges();
}
