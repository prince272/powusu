using AutoMapper;
using Humanizer;
using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using POwusu.Server.Data;
using POwusu.Server.Entities.Blog;
using POwusu.Server.Entities.Identity;
using POwusu.Server.Events.Blog;
using POwusu.Server.Extensions.FileStorage;
using POwusu.Server.Extensions.Identity;
using POwusu.Server.Extensions.ImageProcessor;
using POwusu.Server.Extensions.Validation;
using POwusu.Server.Helpers;
using POwusu.Server.Models.Blog;
using POwusu.Server.Models.Identity;
using System.Net.Mime;
using System.Threading;

namespace POwusu.Server.Services
{
    public class BlogService : IBlogService
    {
        private readonly AppDbContext _appDbContext;
        private readonly UserManager<User> _userManager;
        private readonly IValidator _validator;
        private readonly IMediator _mediator;
        private readonly IMapper _mapper;
        private readonly IUserContext _userContext;
        private readonly IFileStorage _fileStorage;
        private readonly IImageProcessor _imageProcessor;
        private readonly IOptions<BlogServiceOptions> _blogServiceOptions;

        public BlogService(AppDbContext appDbContext, UserManager<User> userManager, IValidator validator, IMediator mediator, IMapper mapper, IUserContext userContext, IFileStorage fileStorage, IImageProcessor imageProcessor, IOptions<BlogServiceOptions> blogServiceOptions)
        {
            _appDbContext = appDbContext;
            _userManager = userManager;
            _validator = validator;
            _mediator = mediator;
            _mapper = mapper;
            _userContext = userContext;
            _fileStorage = fileStorage;
            _imageProcessor = imageProcessor;
            _blogServiceOptions = blogServiceOptions;
        }

        public async Task<Results<Ok<PostModel>, ValidationProblem, UnauthorizedHttpResult, ForbidHttpResult>> CreatePostAsync(PostForm form)
        {
            if (form is null) throw new ArgumentNullException(nameof(form));
            var formValidation = await _validator.ValidateAsync(form);
            if (!formValidation.IsValid) return TypedResults.ValidationProblem(formValidation.Errors);

            var currentUser = await _userContext.GetUserAsync();
            if (currentUser is null) return TypedResults.Unauthorized();

            if (currentUser.ExclusiveRoles(RoleNames.Administrator))
                return TypedResults.Forbid();

            var post = _mapper.Map<Post>(form);
            post.AuthorId = currentUser.Id;
            post.Slug = await GeneratePostSlugAsync(form.Title);
            post.CreatedAt = DateTime.UtcNow;
            post.PublishedAt = form.Published ? DateTime.UtcNow : null;

            await _appDbContext.Set<Post>().AddAsync(post);
            await _appDbContext.SaveChangesAsync();

            await _mediator.Publish(new PostCreated(post));

            var model = await BuildPostModelAsync(post);
            return TypedResults.Ok(model);
        }

        public async Task<Results<Ok<PostModel>, NotFound, ValidationProblem, UnauthorizedHttpResult, ForbidHttpResult>> EditPostAsync(string postId, PostForm form)
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
            post.AuthorId = currentUser.Id;
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

            var post = await _appDbContext.Set<Post>().Include(_ => _.Content).Include(_ => _.Author).FirstOrDefaultAsync(_ => _.Id == postId);
            if (post is null) return TypedResults.NotFound();

            var currentUser = await _userContext.GetUserAsync();
            if (currentUser is null && post.Deleted) return TypedResults.Forbid();

            var model = await BuildPostModelAsync(post);
            return TypedResults.Ok(model);
        }

        public async Task<Results<Ok<PostsPageModel>, ValidationProblem>> GetPostsAsync(PostsFilter? filter = null)
        {
            filter ??= new PostsFilter();
            filter.SetDefaultValues();

            var formValidation = await _validator.ValidateAsync(filter);
            if (!formValidation.IsValid) return TypedResults.ValidationProblem(formValidation.Errors);

            var currentUser = await _userContext.GetUserAsync();

            var query = _appDbContext.Set<Post>().AsQueryable();

            if (currentUser is not null && currentUser.InclusiveRoles(RoleNames.Administrator))
            {
                if (filter.Deleted.HasValue)
                    query = query.Where(_ => _.Deleted == filter.Deleted);
            }
            else
            {
                query = query.Where(_ => !_.Deleted);
            }

            query = query.OrderByDescending(_ => _.UpdatedAt);

            var totalItems = await query.LongCountAsync();
            var totalPages = (int)Math.Ceiling((double)totalItems / filter.PageSize!.Value);
            var currentPage = Math.Max(0, Math.Min(filter.Page!.Value, totalPages));

            var items = await query
                .LongSkip((filter.Page.Value - 1) * filter.PageSize.Value)
                .Take(filter.PageSize.Value)
                .Include(_ => _.Author)
                .ToListAsync();       

            var model = await BuildPostsPageModelAsync(items, new PostsPageModel
            {
                TotalItems = totalItems,
                TotalPages = totalPages,
                CurrentPage = currentPage
            });

            return TypedResults.Ok(model);
        }

        public async Task<Results<ContentHttpResult, NotFound, ValidationProblem, UnauthorizedHttpResult, ForbidHttpResult, StatusCodeHttpResult>> UploadPostImageAsync(UploadPostImageForm form)
        {
            if (form is null) throw new ArgumentNullException(nameof(form));
            var formValidation = await _validator.ValidateAsync(form);
            if (!formValidation.IsValid) return TypedResults.ValidationProblem(formValidation.Errors);

            var status = await _fileStorage.WriteAsync(form.Path, form.Chunk, form.Length, form.Offset);

            if (status == FileWriteStatus.Started || status == FileWriteStatus.Completed)
            {
                var currentUser = await _userContext.GetUserAsync();
                if (currentUser is null) return TypedResults.Unauthorized();

                if (currentUser.ExclusiveRoles(RoleNames.Administrator))
                    return TypedResults.Forbid();

                if (status == FileWriteStatus.Completed)
                {
                    var source = await _fileStorage.ReadAsync(form.Path);
                    if (source is null) return TypedResults.StatusCode(StatusCodes.Status424FailedDependency);

                    await _imageProcessor.ScaleAsync(source, _blogServiceOptions.Value.PostImageScaleWidth);
                }
            }

            return TypedResults.Content(form.Path);
        }

        private async Task<PostModel> BuildPostModelAsync(Post post)
        {
            if (post is null) throw new ArgumentNullException(nameof(post));
            var model = _mapper.Map<PostModel>(post);
            model.ImageUrl = post.ImageId is not null ? _fileStorage.GetUrl(post.ImageId) : null;
            model.Author = await BuildUserModelAsync(post.Author);
            return model;
        }

        private async Task<PublicUserModel> BuildUserModelAsync(User user)
        {
            if (user is null) throw new ArgumentNullException(nameof(user));

            var model = _mapper.Map<PublicUserModel>(user);

            var roles = (await _userManager.GetRolesAsync(user)).ToArray();
            model.Title = user.GetTitle(roles);
            model.ImageUrl = user.ImageId is not null ? _fileStorage.GetUrl(user.ImageId) : null;
            return model;
        }

        private async Task<PostsPageModel> BuildPostsPageModelAsync(IEnumerable<Post> posts, PostsPageModel model)
        {
            if (posts is null) throw new ArgumentNullException(nameof(posts));

            foreach (var post in posts)
            {
                var postItemModel = _mapper.Map<PostItemModel>(post);
                postItemModel.ImageUrl = post.ImageId is not null ? _fileStorage.GetUrl(post.ImageId) : null;
                postItemModel.Author = await BuildUserModelAsync(post.Author);
                model.Items.Add(postItemModel);
            }

            return model;
        }

        private async Task<string> GeneratePostSlugAsync(string title)
        {
            if (title is null) throw new ArgumentNullException(nameof(title));

            string separator = "-";
            string? slug = null;
            int count = 1;

            do
            {
                slug = TextHelper.GenerateSlug($"{title} {(count == 1 ? "" : $" {count}")}".Trim(), separator).ToLower();
                count += 1;
            } while (await _appDbContext.Set<Post>().AnyAsync(_ => _.Slug == slug));

            return slug;
        }
    }

    public interface IBlogService
    {
        Task<Results<Ok<PostModel>, ValidationProblem, UnauthorizedHttpResult, ForbidHttpResult>> CreatePostAsync(PostForm form);

        Task<Results<Ok<PostModel>, NotFound, ValidationProblem, UnauthorizedHttpResult, ForbidHttpResult>> EditPostAsync(string postId, PostForm form);

        Task<Results<Ok, NotFound, ValidationProblem, UnauthorizedHttpResult, ForbidHttpResult>> DeletePostAsync(string postId);

        Task<Results<Ok<PostModel>, NotFound, ValidationProblem, ForbidHttpResult>> GetPostAsync(string postId);

        Task<Results<Ok<PostsPageModel>, ValidationProblem>> GetPostsAsync(PostsFilter? filter = null);

        Task<Results<ContentHttpResult, NotFound, ValidationProblem, UnauthorizedHttpResult, ForbidHttpResult, StatusCodeHttpResult>> UploadPostImageAsync(UploadPostImageForm form);
    }

    public class BlogServiceOptions
    {
        public int PostImageScaleWidth { get; set; }

        public string[] PostImageFileExtensions { get; set; } = Array.Empty<string>();

        public long PostImageFileMaxSize { get; set; }
    }

    public static class BlogServiceExtensions
    {
        public static IServiceCollection AddBlogService(this IServiceCollection services, Action<BlogServiceOptions>? configure = null)
        {
            if (configure is not null) services.Configure(configure);
            services.AddScoped<IBlogService, BlogService>();
            return services;
        }
    }
}
