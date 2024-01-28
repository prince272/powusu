
using AutoMapper;
using POwusu.Server.Entities.Identity;
using POwusu.Server.Extensions.Identity;

namespace POwusu.Server.Models.Identity
{
    public class PrivateUserWithTokenModel : PrivateUserModel
    {
        public string TokenType { get; set; } = null!;

        public string AccessToken { get; set; } = null!;

        public DateTimeOffset AccessTokenExpiresAt { get; set; }

        public string RefreshToken { get; set; } = null!;

        public DateTimeOffset RefreshTokenExpiresAt { get; set; }
    }

    public class UserWithTokenProfile : Profile
    {
        public UserWithTokenProfile()
        {
            CreateMap<JwtTokenInfo, PrivateUserWithTokenModel>();
            CreateMap<User, PrivateUserWithTokenModel>();
        }
    }
}
