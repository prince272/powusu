
using AutoMapper;
using POwusu.Server.Entities.Blog;

namespace POwusu.Server.Models.Blog
{
    public class PostsPageModel(long offset, int limit, long total)
    {
        public long Offset { get; } = offset;
        public int Limit { get; } = limit;
        public long Length { get; } = total;
        public long? Previous => Offset - Limit >= 0 ? Offset - Limit : null;
        public long? Next => Offset + Limit < Length ? Offset + Limit : null;
        public IList<PostItemModel> Items { get; set; } = new List<PostItemModel>();
    }

    public class PostItemModel
    {
        public string UserId { get; set; } = null!;

        public string Id { get; set; } = null!;

        public string Title { get; set; } = null!;

        public string Summary { get; set; } = null!;

        public string Slug { get; set; } = null!;

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
