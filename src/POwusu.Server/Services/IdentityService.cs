using Humanizer;
using Mapster;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using POwusu.Server.Entities.Identity;
using POwusu.Server.Events.Identity;
using POwusu.Server.Extensions.Authentication;
using POwusu.Server.Extensions.Mailing;
using POwusu.Server.Extensions.Messaging;
using POwusu.Server.Extensions.Validation;
using POwusu.Server.Extensions.ViewRenderer;
using POwusu.Server.Helpers;
using POwusu.Server.Models.Identity;
using System.Security.Claims;
using System.Threading;

namespace POwusu.Server.Services
{
    public class IdentityService : IIdentityService
    {
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<Role> _roleManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IJwtTokenManager _jwtTokenManager;
        private readonly IValidator _validator;
        private readonly ILogger<IdentityService> _logger;
        private readonly IMediator _mediator;
        private readonly IEmailSender _emailSender;
        private readonly ISmsSender _smsSender;
        private readonly IViewRenderer _viewRenderer;

        public IdentityService(
            UserManager<User> userManager,
            RoleManager<Role> roleManager,
            SignInManager<User> signInManager,
            IJwtTokenManager jwtGenerator,
            IValidator validator,
            ILogger<IdentityService> logger,
            IMediator mediator,
            IEmailSender emailSender,
            ISmsSender smsSender,
            IViewRenderer viewRenderer)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _signInManager = signInManager;
            _jwtTokenManager = jwtGenerator;
            _validator = validator;
            _logger = logger;
            _mediator = mediator;
            _emailSender = emailSender;
            _smsSender = smsSender;
            _viewRenderer = viewRenderer;
        }


        public async Task<IResult> RegisterAccountAsync(RegisterAccountForm form)
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


            if ((_userManager.Options.SignIn.RequireConfirmedEmail && !user.EmailConfirmed) ||
                (_userManager.Options.SignIn.RequireConfirmedPhoneNumber && !user.PhoneNumberConfirmed) ||
                (_userManager.Options.SignIn.RequireConfirmedAccount && (!user.EmailConfirmed && !user.PhoneNumberConfirmed))) return Results.ValidationProblem(new Dictionary<string, string[]>
            { { nameof(form.Username), [$"'{formUsernameType.Humanize(LetterCasing.Sentence)}' is not confirmed."] } }, extensions: new Dictionary<string, object?> { { "requiresConfirmation", true } });
       
            var model = await GenerateUserAsync(user);
            return Results.Ok(model);
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

            if ((_userManager.Options.SignIn.RequireConfirmedEmail && !user.EmailConfirmed) ||
                (_userManager.Options.SignIn.RequireConfirmedPhoneNumber && !user.PhoneNumberConfirmed) ||
                (_userManager.Options.SignIn.RequireConfirmedAccount && (!user.EmailConfirmed && !user.PhoneNumberConfirmed))) return Results.ValidationProblem(new Dictionary<string, string[]>
            { { nameof(form.Username), [$"'{formUsernameType.Humanize(LetterCasing.Sentence)}' is not confirmed."] } }, extensions: new Dictionary<string, object?> { { "requiresConfirmation", true } });

            var model = await GenerateUserAsync(user);
            return Results.Ok(model);
        }

        public async Task<IResult> GenerateTokenFromExternalAuthenticationAsync(string provider)
        {
            if (provider is null) throw new ArgumentNullException(nameof(provider));

            var externalLoginInfo = await _signInManager.GetExternalLoginInfoAsync();
            if (externalLoginInfo is null) return Results.ValidationProblem(new Dictionary<string, string[]>(), title: "External authentication failed.");

            var username =
                (externalLoginInfo.Principal.FindFirstValue(ClaimTypes.Email) ??
                externalLoginInfo.Principal.FindFirstValue(ClaimTypes.MobilePhone) ??
                externalLoginInfo.Principal.FindFirstValue(ClaimTypes.OtherPhone) ??
                externalLoginInfo.Principal.FindFirstValue(ClaimTypes.HomePhone))!;

            var firstName = externalLoginInfo.Principal.FindFirstValue(ClaimTypes.GivenName) ?? string.Empty;
            var lastName = externalLoginInfo.Principal.FindFirstValue(ClaimTypes.Surname) ?? string.Empty;

            var formUsernameType = ValidationHelper.GetContactType(username);

            var user = formUsernameType switch
            {
                ContactType.EmailAddress => await _userManager.FindByEmailAsync(username),
                ContactType.PhoneNumber => await _userManager.FindByPhoneNumberAsync(username),
                _ => null
            };


            if (user is null)
            {
                user = new User();
                user.UserName = await GenerateUserNameAsync(firstName, lastName);
                user.Email = formUsernameType == ContactType.EmailAddress ? username : null;
                user.PhoneNumber = formUsernameType == ContactType.PhoneNumber ? username : null;
                user.CreatedAt = DateTimeOffset.UtcNow;

                var result = await _userManager.CreateAsync(user);
                if (!result.Succeeded) throw new InvalidOperationException(result.Errors.GetMessage());

                var roles = new List<string> { RoleNames.Member };

                var totalUserCount = await _userManager.Users.LongCountAsync();
                if (totalUserCount == 1) roles.Add(RoleNames.Administrator);

                result = await _userManager.AddToRolesAsync(user, roles);
                if (!result.Succeeded) throw new InvalidOperationException(result.Errors.GetMessage());
            }


            await _userManager.RemoveLoginAsync(user, externalLoginInfo.LoginProvider, externalLoginInfo.ProviderKey);
            await _userManager.AddLoginAsync(user, externalLoginInfo);


            var model = await GenerateUserAsync(user);
            return Results.Ok(model);
        }

        public Task<IResult> ConfigureExternalAuthenticationAsync(string provider, string returnUrl, string[] allowedOrigins)
        {
            if (string.IsNullOrEmpty(provider))
                return Task.FromResult(Results.ValidationProblem(new Dictionary<string, string[]>(), title: $"No authentication provider was specified." ));

            if (string.IsNullOrEmpty(returnUrl))
                return Task.FromResult(Results.ValidationProblem(new Dictionary<string, string[]>(), title: $"No return url was specified."));

            provider = provider.Pascalize();

            if (!allowedOrigins.Any(origin => Uri.Compare(new Uri(origin, UriKind.Absolute), new Uri(origin), UriComponents.SchemeAndServer, UriFormat.UriEscaped, StringComparison.OrdinalIgnoreCase) == 0))
                return Task.FromResult(Results.ValidationProblem(new Dictionary<string, string[]>(), title: $"No return url is not allowed."));

            // Request a redirect to the external sign-in provider.
            var properties = _signInManager.ConfigureExternalAuthenticationProperties(provider, returnUrl);
            return Task.FromResult(Results.Challenge(properties, new[] { provider }));
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

        public async Task<IResult> ConfirmAccountAsync(ConfirmAccountForm form)
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


            if (form.SendCode)
            {
                if (formUsernameType == ContactType.EmailAddress)
                {
                    var code = await _userManager.GenerateChangeEmailTokenAsync(user, form.Username);

                    var message = new EmailMessage
                    {
                        Subject = "Confirm Your Email Address",
                        Body = await _viewRenderer.RenderAsync("/Templates/Email/ConfirmAccount", (user, code)),
                        Recipients = new[] { form.Username }
                    };

                    await _emailSender.SendAsync(message);
                }
                else if (formUsernameType == ContactType.PhoneNumber)
                {
                    var code = await _userManager.GenerateChangePhoneNumberTokenAsync(user, form.Username);

                    var message = new TextMessage
                    {
                        Body = await _viewRenderer.RenderAsync("/Templates/Text/ConfirmAccount", (user, code)),
                        Recipients = new[] { form.Username }
                    };

                    await _smsSender.SendAsync(message);
                }

                return Results.Ok();
            }

            var result = formUsernameType switch
            {
                ContactType.EmailAddress => await _userManager.ChangeEmailAsync(user, form.Username, form.Code),
                ContactType.PhoneNumber => await _userManager.ChangePhoneNumberAsync(user, form.Username, form.Code),
                _ => throw new InvalidOperationException()
            };

            if (!result.Succeeded) return Results.ValidationProblem(new Dictionary<string, string[]>
            { { nameof(form.Code), [$"'{nameof(form.Code).Humanize(LetterCasing.Sentence)}' is not valid."] } });

            var model = await GenerateUserAsync(user);
            return Results.Ok(model);
        }

        public async Task<IResult> ResetPasswordAsync(ResetPasswordForm form)
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


            if (form.SendCode)
            {
                var code = await _userManager.GeneratePasswordResetTokenAsync(user);

                if (formUsernameType == ContactType.EmailAddress)
                {
                    var message = new EmailMessage
                    {
                        Subject = "Reset Your Password",
                        Body = await _viewRenderer.RenderAsync("/Templates/Email/ResetPassword", (user, code)),
                        Recipients = new[] { form.Username }
                    };

                    await _emailSender.SendAsync(message);
                }
                else if (formUsernameType == ContactType.PhoneNumber)
                {
                    var message = new TextMessage
                    {
                        Body = await _viewRenderer.RenderAsync("/Templates/Text/ResetPassword", (user, code)),
                        Recipients = new[] { form.Username }
                    };

                    await _smsSender.SendAsync(message);
                }

                return Results.Ok();
            }

            var result = await _userManager.ResetPasswordAsync(user, form.Code, form.NewPassword);
            if (!result.Succeeded) return Results.ValidationProblem(new Dictionary<string, string[]>
            { { nameof(form.Code), [$"'{nameof(form.Code).Humanize(LetterCasing.Sentence)}' is not valid."] } });

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

        private async Task<UserWithTokenModel> GenerateUserAsync(User user)
        {
            if (user is null) throw new ArgumentNullException(nameof(user));

            var tokenInfo = await _jwtTokenManager.GenerateAsync(user);
            var model = user.Adapt(tokenInfo.Adapt<UserWithTokenModel>());
            model.Roles = (await _userManager.GetRolesAsync(user)).Select(_ => _.Camelize()).ToArray();
            return model;
        }
    }

    public interface IIdentityService
    {
        Task<IResult> RegisterAccountAsync(RegisterAccountForm form);

        Task<IResult> GenerateTokenAsync(GenerateTokenForm form);

        Task<IResult> GenerateTokenFromExternalAuthenticationAsync(string provider);

        Task<IResult> ConfigureExternalAuthenticationAsync(string provider, string returnUrl, string[] allowedOrigins);

        Task<IResult> RefreshTokenAsync(RefreshTokenForm form);

        Task<IResult> RevokeTokenAsync(RevokeTokenForm form);

        Task<IResult> ConfirmAccountAsync(ConfirmAccountForm form);

        Task<IResult> ResetPasswordAsync(ResetPasswordForm form);
    }
}