using System.ComponentModel.DataAnnotations;

namespace Swing.Server.DTOs;

public class RegisterRequest
{
    [Required(ErrorMessage = "Username is required.")]
    [MinLength(3, ErrorMessage = "Username must be at least 3 characters.")]
    [MaxLength(20, ErrorMessage = "Username must be at most 20 characters.")]
    public string Username { get; set; } = string.Empty;

    [Required(ErrorMessage = "Password is required.")]
    [MinLength(4, ErrorMessage = "Password must be at least 4 characters.")]
    public string Password { get; set; } = string.Empty;
}
