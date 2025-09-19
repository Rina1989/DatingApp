using System;
using API.DTOs;
using API.Entities;
using API.Interfaces;

namespace API.Extension;

public static class AppUserExtension
{
    public static UserDTOs ToDto(this AppUser user, ITokenService tokenService)
    {
        return new UserDTOs
        {
            Id = user.Id.ToString(),
            DisplayName = user.DisplayName,
            Email = user.Email,
            Token = tokenService.CreateToken(user)
        };
    }
}
