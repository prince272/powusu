using FluentValidation;
using POwusu.Server.Extensions.Validation;

namespace POwusu.Server.Models.Identity
{
    public class GenerateTokenForm
    {
        public string Username { get; set; } = null!;

        public string Password { get; set; } = null!;
    }

    public class GenerateTokenFormValidator : AbstractValidator<GenerateTokenForm>
    {
        public GenerateTokenFormValidator()
        {
            RuleFor(_ => _.Username).NotEmpty().MaximumLength(128).Username();
            RuleFor(_ => _.Password).NotEmpty().MaximumLength(128);
        }
    }
}
