using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using POwusu.Server.Data;
using POwusu.Server.Entities.Blog;
using POwusu.Server.Entities.Identity;
using POwusu.Server.Events.Blog;
using POwusu.Server.Extensions.FileStorage;
using POwusu.Server.Extensions.Identity;
using POwusu.Server.Extensions.Validation;
using POwusu.Server.Helpers;
using POwusu.Server.Models.Blog;
using System.Net.Mime;
using System.Threading;

namespace POwusu.Server.Services
{
    public class BlogService : IBlogService
    {
        private readonly AppDbContext _appDbContext;
        private readonly IValidator _validator;
        private readonly IMediator _mediator;
        private readonly IMapper _mapper;
        private readonly IUserContext _userContext;
        private readonly IFileStorage _storage;

        public BlogService(AppDbContext appDbContext, IValidator validator, IMediator mediator, IMapper mapper, IUserContext userContext, IFileStorage storage)
        {
            _appDbContext = appDbContext;
            _validator = validator;
            _mediator = mediator;
            _mapper = mapper;
            _userContext = userContext;
            _storage = storage;
        }

        public async Task<Results<Ok<PostModel>, ValidationProblem, UnauthorizedHttpResult, ForbidHttpResult>> CreatePostAsync(CreatePostForm form)
        {
            if (form is null) throw new ArgumentNullException(nameof(form));
            var formValidation = await _validator.ValidateAsync(form);
            if (!formValidation.IsValid) return TypedResults.ValidationProblem(formValidation.Errors);

            var currentUser = await _userContext.GetUserAsync();
            if (currentUser is null) return TypedResults.Unauthorized();

            if (currentUser.ExclusiveRoles(RoleNames.Administrator))
                return TypedResults.Forbid();

            var post = _mapper.Map<Post>(form);
            post.UserId = currentUser.Id;
            post.Slug = await GeneratePostSlugAsync(form.Title);
            post.CreatedAt = DateTime.UtcNow;
            post.PublishedAt = form.Published ? DateTime.UtcNow : null;

            await _appDbContext.Set<Post>().AddAsync(post);
            await _appDbContext.SaveChangesAsync();

            await _mediator.Publish(new PostCreated(post));

            var model = await BuildPostModelAsync(post);
            return TypedResults.Ok(model);
        }

        public async Task<Results<Ok<PostModel>, NotFound, ValidationProblem, UnauthorizedHttpResult, ForbidHttpResult>> EditPostAsync(string postId, EditPostForm form)
        {
            if (string.IsNullOrEmpty(postId))
                return TypedResults.ValidationProblem(new Dictionary<string, string[]>(), title: $"No '{nameof(postId)}' was specified.");

            if (form is null) throw new ArgumentNullException(nameof(form));
            var formValidation = await _validator.ValidateAsync(form);
            if (!formValidation.IsValid) return TypedResults.ValidationProblem(formValidation.Errors);

            var post = await _appDbContext.Set<Post>().Include(_ => _.Content).FirstOrDefaultAsync(_ => _.Id == postId);
            if (post is null) return TypedResults.NotFound();

            var currentUser = await _userContext.GetUserAsync();
            if (currentUser is null) return TypedResults.Unauthorized();

            if (currentUser.ExclusiveRoles(RoleNames.Administrator))
                return TypedResults.Forbid();

            post = _mapper.Map(form, post);
            post.UserId = currentUser.Id;
            post.Slug = await GeneratePostSlugAsync(form.Title);
            post.UpdatedAt = DateTimeOffset.UtcNow;
            post.PublishedAt = form.Published ? post.PublishedAt is not null ? post.PublishedAt : DateTimeOffset.UtcNow : null;


            _appDbContext.Set<Post>().Update(post);
            await _appDbContext.SaveChangesAsync();

            await _mediator.Publish(new PostUpdated(post));

            var model = await BuildPostModelAsync(post);
            return TypedResults.Ok(model);
        }

        public async Task<Results<Ok, NotFound, ValidationProblem, UnauthorizedHttpResult, ForbidHttpResult>> DeletePostAsync(string postId)
        {
            if (string.IsNullOrEmpty(postId))
                return TypedResults.ValidationProblem(new Dictionary<string, string[]>(), title: $"No '{nameof(postId)}' was specified.");

            var post = await _appDbContext.Set<Post>().Include(_ => _.Content).FirstOrDefaultAsync(_ => _.Id == postId);
            if (post is null) return TypedResults.NotFound();

            var currentUser = await _userContext.GetUserAsync();
            if (currentUser is null) return TypedResults.Unauthorized();

            if (currentUser.ExclusiveRoles(RoleNames.Administrator))
                return TypedResults.Forbid();

            post.DeletedAt = DateTimeOffset.UtcNow;
            post.Deleted = true;

            _appDbContext.Set<Post>().Update(post);
            await _appDbContext.SaveChangesAsync();

            await _mediator.Publish(new PostDeleted(post));

            return TypedResults.Ok();
        }

        public async Task<Results<Ok<PostModel>, NotFound, ValidationProblem, ForbidHttpResult>> GetPostAsync(string postId)
        {
            if (string.IsNullOrEmpty(postId))
                return TypedResults.ValidationProblem(new Dictionary<string, string[]>(), title: $"No '{nameof(postId)}' was specified.");

            var post = await _appDbContext.Set<Post>().Include(_ => _.Content).FirstOrDefaultAsync(_ => _.Id == postId);
            if (post is null) return TypedResults.NotFound();

            var currentUser = await _userContext.GetUserAsync();
            if (currentUser is null && post.Deleted) return TypedResults.Forbid();

            var model = await BuildPostModelAsync(post);
            return TypedResults.Ok(model);
        }

        public async Task<Results<Ok<PostsPageModel>, ValidationProblem>> GetPostsAsync(PostsFilter? filter = null)
        {
            if (filter is null) filter = new PostsFilter();
            var formValidation = await _validator.ValidateAsync(filter);
            if (!formValidation.IsValid) return TypedResults.ValidationProblem(formValidation.Errors);

            var currentUser = await _userContext.GetUserAsync();

            var query = _appDbContext.Set<Post>().AsQueryable();

            if (currentUser is null || currentUser.ExclusiveRoles(RoleNames.Administrator))
                query = query.Where(_ => !_.Deleted);


            var totalPosts = await query.LongCountAsync();
            var posts = await query.LongSkip(filter.Offset).Take(filter.Limit).ToListAsync();
            var model = await BuildPostsPageModelAsync(posts, new PostsPageModel(filter.Offset, filter.Limit, totalPosts));
            return TypedResults.Ok(model);
        }

        public async Task<Results<Ok<string>, NotFound, ValidationProblem, UnauthorizedHttpResult, ForbidHttpResult>> UploadPostImageAsync(string postId, UploadPostImageForm form)
        {
            if (string.IsNullOrEmpty(postId))
                return TypedResults.ValidationProblem(new Dictionary<string, string[]>(), title: $"No '{nameof(postId)}' was specified.");

            if (form is null) throw new ArgumentNullException(nameof(form));
            var formValidation = await _validator.ValidateAsync(form);
            if (!formValidation.IsValid) return TypedResults.ValidationProblem(formValidation.Errors);

            var prevStatus = await _storage.CheckAsync(form.Path);
            if (prevStatus == FileStorageStatus.Pending || prevStatus == FileStorageStatus.Processing)
                await _storage.WriteAsync(form.Path, form.Chunk, form.Length, form.Offset);
            var currentStatus = await _storage.CheckAsync(form.Path);


            if (prevStatus == FileStorageStatus.Pending || currentStatus == FileStorageStatus.Completed)
            {
                var post = await _appDbContext.Set<Post>().FindAsync(postId);
                if (post is null) return TypedResults.NotFound();

                var currentUser = await _userContext.GetUserAsync();
                if (currentUser is null) return TypedResults.Unauthorized();

                if (currentUser.ExclusiveRoles(RoleNames.Administrator))
                    return TypedResults.Forbid();

                if (prevStatus == FileStorageStatus.Completed)
                {
                    post.ImageId = form.Path;
                    _appDbContext.Update(post);
                    await _appDbContext.SaveChangesAsync();
                }
            }

            return TypedResults.Ok(form.Path);
        }

        private Task<PostModel> BuildPostModelAsync(Post post)
        {
            if (post is null) throw new ArgumentNullException(nameof(post));
            var model = _mapper.Map<PostModel>(post);
            return Task.FromResult(model);
        }

        private Task<PostsPageModel> BuildPostsPageModelAsync(IEnumerable<Post> posts, PostsPageModel postsPageModel)
        {
            if (posts is null) throw new ArgumentNullException(nameof(posts));

            foreach (var post in posts)
            {
                var postItemModel = _mapper.Map<PostItemModel>(post);
                postsPageModel.Items.Add(postItemModel);
            }

            return Task.FromResult(postsPageModel);
        }

        private async Task<string> GeneratePostSlugAsync(string title)
        {
            if (title is null) throw new ArgumentNullException(nameof(title));

            string separator = "-";
            string? userName = null;
            int count = 1;

            do
            {
                userName = TextHelper.GenerateSlug($"{title} {(count == 1 ? "" : $" {count}")}".Trim(), separator).ToLower();
                count += 1;
            } while (await _appDbContext.Set<Post>().AnyAsync(_ => _.Slug == userName));

            return userName;
        }
    }

    public interface IBlogService
    {
        Task<Results<Ok<PostModel>, ValidationProblem, UnauthorizedHttpResult, ForbidHttpResult>> CreatePostAsync(CreatePostForm form);

        Task<Results<Ok<PostModel>, NotFound, ValidationProblem, UnauthorizedHttpResult, ForbidHttpResult>> EditPostAsync(string postId, EditPostForm form);

        Task<Results<Ok, NotFound, ValidationProblem, UnauthorizedHttpResult, ForbidHttpResult>> DeletePostAsync(string postId);

        Task<Results<Ok<PostModel>, NotFound, ValidationProblem, ForbidHttpResult>> GetPostAsync(string postId);

        Task<Results<Ok<PostsPageModel>, ValidationProblem>> GetPostsAsync(PostsFilter? filter = null);

        Task<Results<Ok<string>, NotFound, ValidationProblem, UnauthorizedHttpResult, ForbidHttpResult>> UploadPostImageAsync(string postId, UploadPostImageForm form);
    }
}
