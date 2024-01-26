using AutoMapper;
using POwusu.Server.Entities.Blog;
using POwusu.Server.Models.Identity;

namespace POwusu.Server.Models.Blog
{
    public class PostModel
    {
        public PublicProfileModel Author { get; set; } = null!;

        public string Id { get; set; } = null!;

        public string Title { get; set; } = null!;

        public string Summary { get; set; } = null!;

        public string Content { get; set; } = null!;

        public string Slug { get; set; } = null!;

        public string? ImageUrl { get; set; }

        public DateTimeOffset CreatedAt { get; set; }

        public DateTimeOffset? UpdatedAt { get; set; }

        public DateTimeOffset? PublishedAt { get; set; }

        public DateTimeOffset? DeletedAt { get; set; }

        public bool Deleted { get; set; }

        public long ReadingDuration { get; set; }
    }

    public class PostProfile : Profile
    {
        public PostProfile()
        {
            CreateMap<Post, PostModel>().ForMember(dest => dest.Content, opt => opt.MapFrom(src => src.Content.Value));
        }
    }
}
