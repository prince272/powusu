﻿using AutoMapper;
using POwusu.Server.Entities.Identity;

namespace POwusu.Server.Models.Identity
{
    public class PublicUserModel
    {
        public string? ImageUrl { get; set; } = null!;

        public string Id { get; set; } = null!;

        public string? FullName { get; set; } = null!;

        public string? FirstName { get; set; } = null!;

        public string? LastName { get; set; } = null!;

        public string UserName { get; set; } = null!;

        public string Email { get; set; } = null!;

        public string PhoneNumber { get; set; } = null!;

        public DateTimeOffset CreatedAt { get; set; }

        public DateTimeOffset? UpdatedAt { get; set; }

        public string Title { get; set; } = null!;

        public string[] Roles { get; set; } = Array.Empty<string>();

        public string? Bio { get; set; }
    }

    public class PublicProfile : Profile
    {
        public PublicProfile()
        {
            CreateMap<User, PublicUserModel>();
        }
    }
}
