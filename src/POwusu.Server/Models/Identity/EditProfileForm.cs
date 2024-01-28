using AutoMapper;
using FluentValidation;
using POwusu.Server.Entities.Identity;
using POwusu.Server.Extensions.Validation;

namespace POwusu.Server.Models.Identity
{
    public class EditProfileForm
    {
        public string FirstName { get; set; } = null!;

        public string LastName { get; set; } = null!;

        public string? Bio { get; set; }
    }

    public class EditProfileFormValidator : AbstractValidator<EditProfileForm>
    {
        public EditProfileFormValidator()
        {
            RuleFor(_ => _.FirstName).NotEmpty().MaximumLength(128);
            RuleFor(_ => _.LastName).NotEmpty().MaximumLength(128);
        }
    }

    public class EditProfileFormProfile : Profile
    {
        public EditProfileFormProfile()
        {
            CreateMap<EditProfileForm, User>();
        }
    }
}
