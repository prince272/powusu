using AutoMapper;
using FluentValidation;
using Humanizer;
using POwusu.Server.Entities.Blog;
using POwusu.Server.Helpers;
using System.Net.Mime;

namespace POwusu.Server.Models.Blog
{
    public class CreatePostForm
    {
        public string Title { get; set; } = null!;

        public string Content { get; set; } = null!;

        public bool Published { get; set; }

        public string ImageId { get; set; } = null!;
    }

    public class CreatePostFormValidator : AbstractValidator<CreatePostForm>
    {
        public CreatePostFormValidator()
        {
            RuleFor(_ => _.Title).NotEmpty().MaximumLength(128);
            RuleFor(_ => _.Content).NotNull();
        }
    }

    public class CreatePostFormProfile : Profile
    {
        public CreatePostFormProfile()
        {
            CreateMap<CreatePostForm, Post>()
                .ForMember(dest => dest.Content, opt => opt.Ignore())
                .AfterMap((src, dest) =>
                {

                    var htmlContent = src.Content ?? string.Empty;
                    var plainContent = TextHelper.StripHtml(htmlContent);
                    var summary = plainContent.Truncate(128, Truncator.FixedLength);
                    var readingDuration = TextHelper.GetTextReadingDuration(plainContent);

                    if (dest.Content is null) dest.Content = new PostContent() { Value = htmlContent, Type = MediaTypeNames.Text.Html };
                    else dest.Content.Value = htmlContent;

                    dest.ReadingDuration = readingDuration;
                    dest.Summary = summary;
                });

        }
    }
}
