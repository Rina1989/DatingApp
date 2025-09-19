using System;
using System.Security.Cryptography;
using System.Text;
using API.Context;
using API.DTOs;
using API.Entities;
using API.Extension;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class AccountContoller : BaseApiController
{
    private readonly AppDbContext _conext;
    private readonly ITokenService _tokenService;
    public AccountContoller(AppDbContext conext, ITokenService tokenService)
    {
        _conext = conext;
        _tokenService = tokenService;
    }

    [HttpPost("Register")]
    public async Task<ActionResult<AppUser>> Register(RegisterDtos model)
    {
        if (await EmailExists(model.email))
        {
            return BadRequest("Email taken");
        }
        var hmac = new HMACSHA512();                 //Randomly generated key help us salt the hashed password
        var user = new AppUser()
        {
            DisplayName = model.displayName,
            Email = model.email,
            PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(model.password)),
            PasswordSalt = hmac.Key
        };
        _conext.Users.Add(user);
        await _conext.SaveChangesAsync();
        return user;
    }

    private async Task<bool> EmailExists(string email)
    {
        return await _conext.Users.AnyAsync(x => x.Email.ToLower() == email.ToLower());
    }
    [HttpPost("Login")]
    public async Task<ActionResult<UserDTOs>> Login(LoginDTOs loginDT)
    {
        var user = await _conext.Users.FirstOrDefaultAsync(x => x.Email == loginDT.email);
        if (user == null) return Unauthorized("Invalid Email Address");
        using var hmac = new HMACSHA512(user.PasswordSalt);
        var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDT.password));
        for (int i = 0; i < computedHash.Length; i++)
        {
            if (computedHash[i] != user.PasswordHash[i])
                return Unauthorized("Invalid Password");
        }
        return user.ToDto(_tokenService);
    }
}
