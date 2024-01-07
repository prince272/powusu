using FluentValidation;

namespace POwusu.Server.Models.Identity
{
    public class RevokeTokenForm
    {
        public string Token { get; set; } = null!;
    }

    public class RevokeTokenFormValidator : AbstractValidator<RevokeTokenForm>
    {
        public RevokeTokenFormValidator()
        {
            RuleFor(_ => _.Token).NotEmpty();
        }
    }
}
