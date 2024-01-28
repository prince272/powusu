using AutoMapper;
using Humanizer;
using POwusu.Server.Entities.Identity;
using POwusu.Server.Extensions.Identity;

namespace POwusu.Server.Models.Identity
{
    public class PrivateUserModel
    {
        public string ImageUrl { get; set; } = null!;

        public string Id { get; set; } = null!;

        public string FullName { get; set; } = null!;

        public string FirstName { get; set; } = null!;

        public string LastName { get; set; } = null!;

        public string UserName { get; set; } = null!;

        public string Email { get; set; } = null!;

        public bool EmailConfirmed { get; set; }

        public string PhoneNumber { get; set; } = null!;

        public bool PhoneNumberConfirmed { get; set; }

        public DateTimeOffset CreatedAt { get; set; }

        public DateTimeOffset? UpdatedAt { get; set; }

        public string Title { get; set; } = null!;

        public string[] Roles { get; set; } = Array.Empty<string>();

        public string? Bio { get; set; }
    }

    public class PrivateProfile : Profile
    {
        public PrivateProfile()
        {
            CreateMap<User, PrivateUserModel>();
        }
    }
}
