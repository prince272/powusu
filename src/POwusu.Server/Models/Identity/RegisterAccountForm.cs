using FluentValidation;
using POwusu.Server.Extensions.Validation;

namespace POwusu.Server.Models.Identity
{
    public class RegisterAccountForm
    {
        public string FirstName { get; set; } = null!;

        public string LastName { get; set; } = null!;

        public string Username { get; set; } = null!;

        public string Password { get; set; } = null!;
    }

    public class RegisterAccountFormValidator : AbstractValidator<RegisterAccountForm>
    {
        public RegisterAccountFormValidator()
        {
            RuleFor(_ => _.FirstName).NotEmpty().MaximumLength(128);
            RuleFor(_ => _.LastName).NotEmpty().MaximumLength(128);
            RuleFor(_ => _.Username).NotEmpty().MaximumLength(128).Username();
            RuleFor(_ => _.Password).NotEmpty().MaximumLength(128).Password();
        }
    }
}
