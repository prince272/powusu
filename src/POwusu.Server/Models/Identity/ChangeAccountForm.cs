using FluentValidation;
using Humanizer;
using POwusu.Server.Extensions.Validation;

namespace POwusu.Server.Models.Identity
{
    public abstract class ChangeAccountForm
    {
        public string CurrentUsername { get; set; } = null!;

        public string NewUsername { get; set; } = null!;

        public string Code { get; set; } = null!;

        public bool SendCode { get; set; }
    }

    public abstract class ChangeAccountFormValidator<TChangeAccountForm> : AbstractValidator<TChangeAccountForm>
        where TChangeAccountForm : ChangeAccountForm
    {
        protected ChangeAccountFormValidator(ContactType contactType)
        {
            RuleFor(_ => _.CurrentUsername).NotEmpty().WithName($"Current {contactType.ToString().Humanize(LetterCasing.LowerCase)}").MaximumLength(128).Username(contactType);
            RuleFor(_ => _.NewUsername).NotEmpty().WithName($"New {contactType.ToString().Humanize(LetterCasing.LowerCase)}").MaximumLength(128).Username().NotEqual(_ => _.CurrentUsername);
            RuleFor(_ => _.Code).NotEmpty().MaximumLength(128).When(_ => !_.SendCode, ApplyConditionTo.AllValidators);
        }
    }

    public class ChangeEmailForm : ChangeAccountForm
    {
    }

    public class ChangeEmailFormValidator : ChangeAccountFormValidator<ChangeEmailForm>
    {
        public ChangeEmailFormValidator() : base(ContactType.Email)
        {
        }
    }

    public class ChangePhoneNumberForm : ChangeAccountForm
    {
    }

    public class ChangePhoneNumberFormValidator : ChangeAccountFormValidator<ChangePhoneNumberForm>
    {
        public ChangePhoneNumberFormValidator() : base(ContactType.PhoneNumber)
        {
        }
    }
}
