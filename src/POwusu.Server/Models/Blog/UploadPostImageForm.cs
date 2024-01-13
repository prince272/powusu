using FluentValidation;
using Humanizer;
using Microsoft.Extensions.Options;
using POwusu.Server.Extensions.FileStorage;
using POwusu.Server.Extensions.Validation;
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

    public abstract class UploadMediaContentFormValidator : AbstractValidator<UploadPostImageForm>
    {
        public UploadMediaContentFormValidator(IOptions<FileCriteriaOptions> fileCriteriaOptions)
        {

            RuleFor(_ => _.Name)
                .NotEmpty();

            RuleFor(_ => _.Path)
                .NotEmpty()
                .Must(path => !string.IsNullOrWhiteSpace(path) && Path.GetInvalidPathChars().All(c => !path.Contains(c)))
                .WithMessage("The file path is not valid.")

                .Must((form, path) => Path.HasExtension(path))
                .WithMessage("The file path must contain an extension.")
                
                .Must((form, path) => fileCriteriaOptions.Value.Has(fileCriteriaOptions.Value.Images, Path.GetExtension(path)))
                .WithMessage((form, path) => $"The file extension '{Path.GetExtension(path).ToLower()}' is not allowed.");

            RuleFor(_ => _.Length)
                .Must((form, length) =>
                {
                    var maxLength = fileCriteriaOptions.Value.Get(fileCriteriaOptions.Value.Images, Path.GetExtension(form.Path))?.Length;
                    return length <= maxLength;
                })
                .WithMessage((form, fileSize) =>
                {
                    var maxLength = fileCriteriaOptions.Value.Get(fileCriteriaOptions.Value.Images, Path.GetExtension(form.Path))?.Length;
                    if (!maxLength.HasValue) return "Unable to determine maximum file size since file is not allowed.";

                    return $"The file size must be {maxLength.Value.Bytes().Humanize()} or smaller.";
                });

            RuleFor(_ => _.Chunk).NotNull();
        }
    }
}
