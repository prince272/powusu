using FluentValidation;
using POwusu.Server.Extensions.Validation;

namespace POwusu.Server.Models.Identity
{
    public class CreatePasswordForm
    {
        public string NewPassword { get; set; } = null!;

        public string ConfirmPassword { get; set; } = null!;
    }

    public class CreatePasswordFormValidator : AbstractValidator<CreatePasswordForm>
    {
        public CreatePasswordFormValidator()
        {
            RuleFor(_ => _.NewPassword).NotEmpty().MaximumLength(128).Password();

            RuleFor(_ => _.ConfirmPassword).NotEmpty().MaximumLength(128).Equal(_ => _.NewPassword)
                .WithMessage("'Confirm password' must be equal to 'New password'");
        }
    }
}
