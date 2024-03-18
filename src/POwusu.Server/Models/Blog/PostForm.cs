using AutoMapper;
using FluentValidation;
using Humanizer;
using POwusu.Server.Entities.Blog;
using POwusu.Server.Helpers;
using System.Net.Mime;

namespace POwusu.Server.Models.Blog
{
    public class PostForm
    {
        public string Title { get; set; } = null!;

        public string Content { get; set; } = null!;

        public string ContentType { get; set; } = null!;

        public PostCategory Category { get; set; }

        public bool Published { get; set; }

        public string? ImageId { get; set; } = null!;

        public string? Summary { get; set; } = null!;

        public long ReadingDuration { get; set; }
    }

    public class PostFormValidator : AbstractValidator<PostForm>
    {
        public PostFormValidator()
        {
            RuleFor(_ => _.Title).NotEmpty().MaximumLength(128);
            RuleFor(_ => _.Content).NotEmpty();
            RuleFor(_ => _.ContentType).NotEmpty().MaximumLength(128);
            RuleFor(_ => _.ReadingDuration).GreaterThanOrEqualTo(0);
        }
    }

    public class PostFormProfile : Profile
    {
        public PostFormProfile()
        {
            CreateMap<PostForm, Post>()
                .ForMember(dest => dest.Content, opt => opt.Ignore())
                .AfterMap((src, dest) =>
                {
                    if (dest.Content is null)
                    {
                        dest.Content = new PostContent()
                        {
                            Value = src.Content,
                            Type = src.ContentType
                        };
                    }
                    else
                    {
                        dest.Content.Value = src.Content;
                        dest.Content.Type = src.ContentType;
                    }
                });

        }
    }
}