using FluentValidation;
using POwusu.Server.Extensions.Validation;

namespace POwusu.Server.Models.Identity
{
    public class ChangePasswordForm
    {
        public string CurrentPassword { get; set; } = null!;

        public string NewPassword { get; set; } = null!;
    }

    public class ChangePasswordFormValidator : AbstractValidator<ChangePasswordForm>
    {
        public ChangePasswordFormValidator()
        {
            RuleFor(_ => _.CurrentPassword).NotEmpty().MaximumLength(128);
            RuleFor(_ => _.NewPassword).NotEmpty().MaximumLength(128).Password().NotEqual(_ => _.CurrentPassword)
                .WithMessage("'New password' must be different from the 'current password'.");
        }
    }
}
