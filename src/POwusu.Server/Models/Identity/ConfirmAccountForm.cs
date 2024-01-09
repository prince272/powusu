using FluentValidation;
using POwusu.Server.Extensions.Validation;

namespace POwusu.Server.Models.Identity
{
    public class ConfirmAccountForm
    {
        public string Username { get; set; } = null!;

        public string Code { get; set; } = null!;

        public bool SendCode { get; set; }
    }

    public class ConfirmAccountFormValidator : AbstractValidator<ConfirmAccountForm>
    {
        public ConfirmAccountFormValidator()
        {
            RuleFor(_ => _.Username).NotEmpty().MaximumLength(128).Username();
            RuleFor(_ => _.Code).NotEmpty().MaximumLength(128).When(_ => !_.SendCode, ApplyConditionTo.AllValidators);
        }
    }
}
