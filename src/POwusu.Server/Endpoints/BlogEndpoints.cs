
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

            builder.MapPost("/posts", ([FromServices] IBlogService blogService, [FromBody] CreatePostForm form)
                => blogService.CreatePostAsync(form));

            builder.MapPut("/posts/{postId}", ([FromServices] IBlogService blogService, [FromRoute] string postId, [FromBody] EditPostForm form)
                => blogService.EditPostAsync(postId, form));

            builder.MapDelete("/posts/{postId}", ([FromServices] IBlogService blogService, [FromRoute] string postId)
                => blogService.DeletePostAsync(postId));

            builder.MapGet("/posts", ([FromServices] IBlogService blogService, [AsParameters] PostsFilter filter)
                => blogService.GetPostsAsync(filter));

            builder.MapPost("/posts/{postId}/images", async ([FromServices] IBlogService blogService, HttpContext httpContext, [FromRoute] string postId,
                [FromHeader(Name = "Upload-Name")] string name,
                [FromHeader(Name = "Upload-Length")] long length) =>
            {
                var uniqueName = $"{Guid.NewGuid()}{Path.GetExtension(name)}".ToLower();
                var path = httpContext.Request.Path.ToString().AppendPathSegment(uniqueName).ToString().ToLower();
                await blogService.UploadPostImageAsync(postId, new UploadPostImageForm
                {
                    Name = name,
                    Path = path,
                    Length = length,
                    Offset = 0,
                    Chunk = await httpContext.Request.Body.ToMemoryStreamAsync()
                });

                return Results.Content(path);
            });

            builder.MapPatch("/posts/{postId}/images/{imageId}", async ([FromServices] IBlogService blogService, HttpContext httpContext, [FromRoute] string postId, [FromRoute] string imageId,
                [FromHeader(Name = "Upload-Name")] string name,
                [FromHeader(Name = "Upload-Length")] long length,
                [FromHeader(Name = "Upload-Offset")] long offset) =>
            {
                var path = httpContext.Request.Path.ToString().ToLower();
                await blogService.UploadPostImageAsync(postId, new UploadPostImageForm
                {
                    Name = name,
                    Path = path,
                    Length = length,
                    Offset = offset,
                    Chunk = await httpContext.Request.Body.ToMemoryStreamAsync()
                });

                return Results.Ok();
            });
        }
    }
}