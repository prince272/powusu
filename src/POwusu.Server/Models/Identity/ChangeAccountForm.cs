using FluentValidation;
using Humanizer;
using POwusu.Server.Extensions.Validation;

namespace POwusu.Server.Models.Identity
{
    public class ChangeEmailForm 
    {
        public string NewEmail { get; set; } = null!;

        public string Code { get; set; } = null!;

        public bool SendCode { get; set; }
    }

    public class ChangeEmailFormValidator : AbstractValidator<ChangeEmailForm>
    {
        public ChangeEmailFormValidator()
        {
            RuleFor(_ => _.NewEmail).NotEmpty().MaximumLength(128).Email();
            RuleFor(_ => _.Code).NotEmpty().MaximumLength(128).When(_ => !_.SendCode, ApplyConditionTo.AllValidators);
        }
    }

    public class ChangePhoneNumberForm
    {
        public string NewPhoneNumber { get; set; } = null!;

        public string Code { get; set; } = null!;

        public bool SendCode { get; set; }
    }

    public class ChangePhoneNumberFormValidator : AbstractValidator<ChangePhoneNumberForm>
    {
        public ChangePhoneNumberFormValidator()
        {
            RuleFor(_ => _.NewPhoneNumber).NotEmpty().MaximumLength(128).PhoneNumber();
            RuleFor(_ => _.Code).NotEmpty().MaximumLength(128).When(_ => !_.SendCode, ApplyConditionTo.AllValidators);
        }
    }
}
