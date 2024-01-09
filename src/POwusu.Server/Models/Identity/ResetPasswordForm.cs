using FluentValidation;
using POwusu.Server.Extensions.Validation;

namespace POwusu.Server.Models.Identity
{
    public class ResetPasswordForm
    {
        public string Username { get; set; } = null!;

        public string Code { get; set; } = null!;

        public bool SendCode { get; set; }

        public string NewPassword { get; set; } = null!;
    }

    public class ResetPasswordFormValidator : AbstractValidator<ResetPasswordForm>
    {
        public ResetPasswordFormValidator()
        {
            RuleFor(_ => _.Username).NotEmpty().MaximumLength(128).Username();
            RuleFor(_ => _.Code).NotEmpty().MaximumLength(128).When(_ => !_.SendCode, ApplyConditionTo.AllValidators);
            RuleFor(_ => _.NewPassword).NotEmpty().MaximumLength(128).Password().When(_ => !_.SendCode, ApplyConditionTo.AllValidators);
        }
    }
}
