
using AutoMapper;
using POwusu.Server.Entities.Blog;
using POwusu.Server.Models.Identity;

namespace POwusu.Server.Models.Blog
{
    public class PostsPageModel()
    {
        public long TotalItems { get; set; }

        public int TotalPages { get; set; }

        public int CurrentPage { get; set; }

        public int NextPage => CurrentPage < TotalPages ? CurrentPage + 1 : TotalPages;

        public int PreviousPage => CurrentPage > 1 ? CurrentPage - 1 : 1;

        public IList<PostItemModel> Items { get; set; } = new List<PostItemModel>();
    }

    public class PostItemModel
    {
        public PublicUserModel Author { get; set; } = null!;

        public string Id { get; set; } = null!;

        public string Title { get; set; } = null!;

        public string Summary { get; set; } = null!;

        public string Slug { get; set; } = null!;

        public string? ImageUrl { get; set; }

        public DateTimeOffset CreatedAt { get; set; }

        public DateTimeOffset? UpdatedAt { get; set; }

        public DateTimeOffset? PublishedAt { get; set; }

        public DateTimeOffset? DeletedAt { get; set; }

        public bool Deleted { get; set; }

        public long ReadingDuration { get; set; }
    }

    public class PostItemProfile : Profile
    {
        public PostItemProfile()
        {
            CreateMap<Post, PostItemModel>();
        }
    }
}
