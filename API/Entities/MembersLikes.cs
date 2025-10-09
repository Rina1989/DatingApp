using System;

namespace API.Entities;

public class MemberLike
{
    public required string SourceMemberId { get; set; }
    public Member SourceMember { get; set; } = null!;
    public required string TargerMemberId { get; set; }
    public Member TargetMember { get; set; } = null!;
}
