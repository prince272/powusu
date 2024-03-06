
using Microsoft.AspNetCore.Mvc;
using POwusu.Server.Extensions.Routing;
using POwusu.Server.Models.Blog;
using POwusu.Server.Services;
using Flurl;
using POwusu.Server.Helpers;
using POwusu.Server.Models.Identity;

namespace POwusu.Server.Endpoints
{
    public class BlogEndpoints : IEndpoints
    {
        public BlogEndpoints()
        {
        }

        public void Configure(IEndpointRouteBuilder builder)
        {
            builder = builder.MapGroup("/blog");

            builder.MapPost("posts", ([FromServices] IBlogService blogService, [FromBody] PostForm form)
                => blogService.CreatePostAsync(form));

            builder.MapPut("posts/{postId}", ([FromServices] IBlogService blogService, [FromRoute] string postId, [FromBody] PostForm form)
                => blogService.EditPostAsync(postId, form));

            builder.MapDelete("posts/{postId}", ([FromServices] IBlogService blogService, [FromRoute] string postId)
                => blogService.DeletePostAsync(postId));
            
            builder.MapGet("posts/{postId}", ([FromServices] IBlogService blogService, [FromRoute] string postId)
                => blogService.GetPostAsync(postId));

            builder.MapGet("posts", ([FromServices] IBlogService blogService, [AsParameters] PostsFilter filter)
                => blogService.GetPostsAsync(filter));

            builder.MapPost("posts/images", async ([FromServices] IBlogService blogService, HttpContext httpContext,
                [FromHeader(Name = "Upload-Name")] string name,
                [FromHeader(Name = "Upload-Length")] long length) =>
            {
                var path = $"/posts/images/{Guid.NewGuid()}{Path.GetExtension(name)}".ToLower();
                var result = await blogService.UploadPostImageAsync(new UploadPostImageForm
                {
                    Name = name,
                    Path = path,
                    Length = length,
                    Offset = 0,
                    Chunk = await httpContext.Request.Body.ToMemoryStreamAsync()
                });

                return result;
            });

            builder.MapPatch("posts/images", async ([FromServices] IBlogService blogService, HttpContext httpContext, [FromQuery] string path,
                [FromHeader(Name = "Upload-Name")] string name,
                [FromHeader(Name = "Upload-Length")] long length,
                [FromHeader(Name = "Upload-Offset")] long offset) =>
            {
                var result = await blogService.UploadPostImageAsync(new UploadPostImageForm
                {
                    Name = name,
                    Path = path,
                    Length = length,
                    Offset = offset,
                    Chunk = await httpContext.Request.Body.ToMemoryStreamAsync()
                });

                return result;
            });
        }
    }
}