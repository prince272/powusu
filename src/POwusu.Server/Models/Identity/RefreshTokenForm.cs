using FluentValidation;

namespace POwusu.Server.Models.Identity
{
    public class RefreshTokenForm
    {
        public string Token { get; set; } = null!;
    }

    public class RefreshTokenFormValidator : AbstractValidator<RefreshTokenForm>
    {
        public RefreshTokenFormValidator()
        {
            RuleFor(_ => _.Token).NotEmpty();
        }
    }
}
