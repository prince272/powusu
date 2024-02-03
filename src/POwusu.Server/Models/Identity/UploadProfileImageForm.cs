using FluentValidation;
using Humanizer;
using Microsoft.Extensions.Options;
using POwusu.Server.Extensions.FileStorage;
using POwusu.Server.Extensions.Validation;
using POwusu.Server.Services;
using System.IO;

namespace POwusu.Server.Models.Identity
{
    public class UploadProfileImageForm
    {
        public string Name { get; set; } = null!;

        public long Length { get; set; }

        public long Offset { get; set; }

        public string Path { get; set; } = null!;

        public Stream Chunk { get; set; } = null!;
    }

    public class UploadProfileImageFormValidator : AbstractValidator<UploadProfileImageForm>
    {
        public UploadProfileImageFormValidator(IOptions<IdentityServiceOptions> identityServiceOptions)
        {

            RuleFor(_ => _.Name)
                .NotEmpty();

            RuleFor(_ => _.Path)
                .NotEmpty()
                .Must(path => !string.IsNullOrWhiteSpace(path) && Path.GetInvalidPathChars().All(c => !path.Contains(c)))
                .WithMessage("The file path is not valid.")

                .Must((form, path) => Path.HasExtension(path))
                .WithMessage("The file path must contain an extension.")
                
                .Must((form, path) => identityServiceOptions.Value.ProfileImageFileExtensions.Contains(Path.GetExtension(path), StringComparer.OrdinalIgnoreCase))
                .WithMessage((form, path) => $"The file extension '{Path.GetExtension(path).ToLower()}' is not allowed.");

            RuleFor(_ => _.Length)
                .Must((form, fileSize) =>
                {
                    var fileMaxSize = identityServiceOptions.Value.ProfileImageFileMaxSize;
                    return fileSize <= fileMaxSize;
                })
                .WithMessage((form, fileSize) =>
                {
                    var fileMaxSize = identityServiceOptions.Value.ProfileImageFileMaxSize;
                    return $"The file size must be {fileMaxSize.Bytes().Humanize()} or smaller.";
                });

            RuleFor(_ => _.Chunk).NotNull();
        }
    }
}
