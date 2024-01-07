using Humanizer;
using Mapster;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using POwusu.Server.Entities.Identity;
using POwusu.Server.Events.Identity;
using POwusu.Server.Extensions.Authentication;
using POwusu.Server.Extensions.Validation;
using POwusu.Server.Helpers;
using POwusu.Server.Models.Identity;

namespace POwusu.Server.Services
{
    public class IdentityService : IIdentityService
    {
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<Role> _roleManager;
        private readonly IJwtTokenManager _jwtTokenManager;
        private readonly IValidator _validator;
        private readonly ILogger<IdentityService> _logger;
        private readonly IMediator _mediator;

        public IdentityService(
            UserManager<User> userManager,
            RoleManager<Role> roleManager,
            IJwtTokenManager jwtGenerator,
            IValidator validator,
            ILogger<IdentityService> logger, 
            IMediator mediator)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _jwtTokenManager = jwtGenerator;
            _validator = validator;
            _logger = logger;
            _mediator = mediator;
        }


        public async Task<IResult> RegisterAsync(RegisterForm form)
        {
            if (form is null) throw new ArgumentNullException(nameof(form));
            var formValidation = await _validator.ValidateAsync(form);
            if (!formValidation.IsValid) return Results.ValidationProblem(formValidation.Errors);


            var formUsernameType = ValidationHelper.GetContactType(form.Username);
            var user = formUsernameType switch
            {
                ContactType.EmailAddress => await _userManager.FindByEmailAsync(form.Username),
                ContactType.PhoneNumber => await _userManager.FindByPhoneNumberAsync(form.Username),
                _ => null
            };


            if (user is not null) return Results.ValidationProblem(new Dictionary<string, string[]>
            { { nameof(form.Username), [$"'{formUsernameType.Humanize(LetterCasing.Sentence)}' is already taken."] } });


            user = form.Adapt<User>();
            user.UserName = await GenerateUserNameAsync(form.FirstName, form.LastName);
            user.Email = formUsernameType == ContactType.EmailAddress ? form.Username : null;
            user.PhoneNumber = formUsernameType == ContactType.PhoneNumber ? form.Username : null;
            user.CreatedAt = DateTimeOffset.UtcNow;

            var result = await _userManager.CreateAsync(user, form.Password);
            if (!result.Succeeded) throw new InvalidOperationException(result.Errors.GetMessage());


            var roles = new List<string> { RoleNames.Member };

            var totalUserCount = await _userManager.Users.LongCountAsync();
            if (totalUserCount == 1) roles.Add(RoleNames.Administrator);

            result = await _userManager.AddToRolesAsync(user, roles);
            if (!result.Succeeded) throw new InvalidOperationException(result.Errors.GetMessage());

            await _mediator.Publish(new SignUpEvent { UserId = user.Id });

            return Results.Ok();
        }

        public async Task<IResult> GenerateTokenAsync(GenerateTokenForm form)
        {
            if (form is null) throw new ArgumentNullException(nameof(form));
            var formValidation = await _validator.ValidateAsync(form);
            if (!formValidation.IsValid) return Results.ValidationProblem(formValidation.Errors);


            var formUsernameType = ValidationHelper.GetContactType(form.Username);
            var user = formUsernameType switch
            {
                ContactType.EmailAddress => await _userManager.FindByEmailAsync(form.Username),
                ContactType.PhoneNumber => await _userManager.FindByPhoneNumberAsync(form.Username),
                _ => null
            };


            if (user is null) return Results.ValidationProblem(new Dictionary<string, string[]>
            { { nameof(form.Username), [$"'{formUsernameType.Humanize(LetterCasing.Sentence)}' does not exist."] } });

            if (!await _userManager.CheckPasswordAsync(user, form.Password)) return Results.ValidationProblem(new Dictionary<string, string[]>
            { { nameof(form.Password), [$"'{nameof(form.Password).Humanize(LetterCasing.Sentence)}' is not correct."] } });

            var tokenInfo = await _jwtTokenManager.GenerateAsync(user);
            var model = user.Adapt(tokenInfo.Adapt<UserWithTokenModel>());
            model.Roles = (await _userManager.GetRolesAsync(user)).Select(_ => _.Camelize()).ToArray();
            return Results.Ok(model);
        }

        public async Task<IResult> RefreshTokenAsync(RefreshTokenForm form)
        {
            if (form is null) throw new ArgumentNullException(nameof(form));
            var formValidation = await _validator.ValidateAsync(form);
            if (!formValidation.IsValid) return Results.ValidationProblem(formValidation.Errors);


            var user = await _jwtTokenManager.FindUserByTokenAsync(form.Token);
            if (user is null) return Results.ValidationProblem(new Dictionary<string, string[]>
            { { nameof(form.Token), [$"'{nameof(form.Token).Humanize(LetterCasing.Sentence)}' is not valid."] } });


            var tokenInfo = await _jwtTokenManager.GenerateAsync(user);
            var model = user.Adapt(tokenInfo.Adapt<UserWithTokenModel>());
            model.Roles = (await _userManager.GetRolesAsync(user)).Select(_ => _.Camelize()).ToArray();
            return Results.Ok(model);
        }

        public async Task<IResult> RevokeTokenAsync(RevokeTokenForm form)
        {
            if (form is null) throw new ArgumentNullException(nameof(form));
            var formValidation = await _validator.ValidateAsync(form);
            if (!formValidation.IsValid) return Results.ValidationProblem(formValidation.Errors);


            var user = await _jwtTokenManager.FindUserByTokenAsync(form.Token);
            if (user is null) return Results.ValidationProblem(new Dictionary<string, string[]>
            { { nameof(form.Token), [$"'{nameof(form.Token).Humanize(LetterCasing.Sentence)}' is not valid."] } });


            await _jwtTokenManager.InvalidateAsync(user, form.Token);
            return Results.Ok();
        }

        private async Task<string> GenerateUserNameAsync(string firstName, string lastName)
        {
            if (firstName is null) throw new ArgumentNullException(nameof(firstName));
            if (lastName is null) throw new ArgumentNullException(nameof(lastName));

            string separator = "-";
            string? userName = null;
            int count = 1;

            do
            {
                userName = TextHelper.GenerateSlug($"{firstName} {lastName} {(count == 1 ? "" : $" {count}")}".Trim(), separator).ToLower();
                count += 1;
            } while (await _userManager.Users.AnyAsync(_ => _.UserName == userName));

            return userName;
        }
    }

    public interface IIdentityService
    {
        Task<IResult> RegisterAsync(RegisterForm form);

        Task<IResult> GenerateTokenAsync(GenerateTokenForm form);

        Task<IResult> RefreshTokenAsync(RefreshTokenForm form);

        Task<IResult> RevokeTokenAsync(RevokeTokenForm form);
    }
}