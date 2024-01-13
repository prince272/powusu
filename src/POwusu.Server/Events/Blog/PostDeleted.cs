using MediatR;
using POwusu.Server.Entities.Blog;

namespace POwusu.Server.Events.Blog
{
    public class PostDeleted(Post post) : INotification
    {
        public Post Post { get; } = post;
    }
}
