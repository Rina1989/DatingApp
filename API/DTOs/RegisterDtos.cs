using System;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class RegisterDtos
{
  [Required] [EmailAddress]public string email { get; set; } = "";
  [Required]public string displayName { get; set; } = "";
  [Required][MinLength(6)]public string password { get; set; } = "";
  [Required] public string Gender { get; set; } = string.Empty;
  [Required] public string City { get; set; } = string.Empty;
  [Required] public string Country { get; set; } = string.Empty;
  [Required]public DateOnly DateOfBirth { get; set; } 
  
}
