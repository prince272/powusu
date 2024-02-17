using FluentValidation;
using Humanizer;
using Microsoft.Extensions.Options;
using POwusu.Server.Extensions.FileStorage;
using POwusu.Server.Extensions.Validation;
using POwusu.Server.Services;
using System.IO;

namespace POwusu.Server.Models.Blog
{
    public class UploadPostImageForm
    {
        public string Name { get; set; } = null!;

        public long Length { get; set; }

        public long Offset { get; set; }

        public string Path { get; set; } = null!;

        public Stream Chunk { get; set; } = null!;
    }

    public class UploadPostImageFormValidator : AbstractValidator<UploadPostImageForm>
    {
        public UploadPostImageFormValidator(IOptions<BlogServiceOptions> blogServiceOptions)
        {

            RuleFor(_ => _.Name)
                .NotEmpty();

            RuleFor(_ => _.Path)
                .NotEmpty()
                .Must(path => !string.IsNullOrWhiteSpace(path) && Path.GetInvalidPathChars().All(c => !path.Contains(c)))
                .WithMessage("The file path is not valid.")

                .Must((form, path) => Path.HasExtension(path))
                .WithMessage("The file path must contain an extension.")
                
                .Must((form, path) => blogServiceOptions.Value.PostImageFileExtensions.Contains(Path.GetExtension(path), StringComparer.OrdinalIgnoreCase))
                .WithMessage((form, path) => $"The file extension '{Path.GetExtension(path).ToLower()}' is not allowed.");

            RuleFor(_ => _.Length)
                .Must((form, fileSize) =>
                {
                    var fileMaxSize = blogServiceOptions.Value.PostImageFileMaxSize;
                    return fileSize <= fileMaxSize;
                })
                .WithMessage((form, fileSize) =>
                {
                    var fileMaxSize = blogServiceOptions.Value.PostImageFileMaxSize;
                    return $"The file size must be {fileMaxSize.Bytes().Humanize()} or smaller.";
                });

            RuleFor(_ => _.Chunk).NotNull();
        }
    }
}
