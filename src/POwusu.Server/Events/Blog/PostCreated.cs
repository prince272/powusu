using MediatR;
using POwusu.Server.Entities.Blog;

namespace POwusu.Server.Events.Blog
{
    public class PostCreated(Post post) : INotification
    {
        public Post Post { get; } = post;
    }
}
