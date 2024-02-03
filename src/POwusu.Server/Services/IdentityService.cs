using AutoMapper;
using Humanizer;
using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using POwusu.Server.Entities.Identity;
using POwusu.Server.Extensions.EmailSender;
using POwusu.Server.Extensions.FileStorage;
using POwusu.Server.Extensions.Identity;
using POwusu.Server.Extensions.ImageProcessor;
using POwusu.Server.Extensions.MessageSender;
using POwusu.Server.Extensions.Validation;
using POwusu.Server.Extensions.ViewRenderer;
using POwusu.Server.Helpers;
using POwusu.Server.Models.Identity;
using System.Security.Claims;

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
        private readonly IMessageSender _smsSender;
        private readonly IViewRenderer _viewRenderer;
        private readonly IMapper _mapper;
        private readonly IFileStorage _fileStorage;
        private readonly IImageProcessor _imageProcessor;
        private readonly IUserContext _userContext;
        private readonly IOptions<IdentityServiceOptions> _identityServiceOptions;

        public IdentityService(
            UserManager<User> userManager,
            RoleManager<Role> roleManager,
            SignInManager<User> signInManager,
            IJwtTokenManager jwtGenerator,
            IValidator validator,
            ILogger<IdentityService> logger,
            IMediator mediator,
            IEmailSender emailSender,
            IMessageSender smsSender,
            IViewRenderer viewRenderer,
            IMapper mapper,
            IFileStorage fileStorage,
            IImageProcessor imageProcessor,
            IUserContext userContext,
            IOptions<IdentityServiceOptions> identityServiceOptions)
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
            _mapper = mapper;
            _fileStorage = fileStorage;
            _imageProcessor = imageProcessor;
            _userContext = userContext;
            _identityServiceOptions = identityServiceOptions;
        }


        public async Task<Results<Ok<PrivateUserWithTokenModel>, ValidationProblem>> RegisterAccountAsync(RegisterAccountForm form)
        {
            if (form is null) throw new ArgumentNullException(nameof(form));
            var formValidation = await _validator.ValidateAsync(form);
            if (!formValidation.IsValid) return TypedResults.ValidationProblem(formValidation.Errors);


            var contactType = ValidationHelper.GetContactType(form.Username);
            var user = contactType switch
            {
                ContactType.Email => await _userManager.FindByEmailAsync(form.Username),
                ContactType.PhoneNumber => await _userManager.FindByPhoneNumberAsync(form.Username),
                _ => null
            };


            if (user is not null) return TypedResults.ValidationProblem(new Dictionary<string, string[]>
            { { nameof(form.Username), [$"'{contactType.Humanize(LetterCasing.Sentence)}' is already taken."] } });


            user = _mapper.Map<User>(form);
            user.UserName = await GenerateUserNameAsync(form.FirstName, form.LastName);
            user.Email = contactType == ContactType.Email ? form.Username : null;
            user.PhoneNumber = contactType == ContactType.PhoneNumber ? form.Username : null;
            user.CreatedAt = DateTimeOffset.UtcNow;
            user.HasPassword = true;

            var result = await _userManager.CreateAsync(user, form.Password);
            if (!result.Succeeded) throw new InvalidOperationException(result.Errors.GetMessage());

            var roles = new List<string> { RoleNames.Member };

            var totalUserCount = await _userManager.Users.LongCountAsync();
            if (totalUserCount == 1) roles.Add(RoleNames.Administrator);

            result = await _userManager.AddToRolesAsync(user, roles);
            if (!result.Succeeded) throw new InvalidOperationException(result.Errors.GetMessage());


            if ((_userManager.Options.SignIn.RequireConfirmedEmail && !user.EmailConfirmed) ||
                (_userManager.Options.SignIn.RequireConfirmedPhoneNumber && !user.PhoneNumberConfirmed) ||
                (_userManager.Options.SignIn.RequireConfirmedAccount && (!user.EmailConfirmed && !user.PhoneNumberConfirmed))) return TypedResults.ValidationProblem(new Dictionary<string, string[]>
            { { nameof(form.Username), [$"'{contactType.Humanize(LetterCasing.Sentence)}' is not confirmed."] } }, extensions: new Dictionary<string, object?> { { "requiresConfirmation", true } });

            var model = await BuildUserWithTokenModelAsync(user);
            return TypedResults.Ok(model);
        }

        public async Task<Results<Ok<PrivateUserWithTokenModel>, ValidationProblem>> GenerateTokenAsync(GenerateTokenForm form)
        {
            if (form is null) throw new ArgumentNullException(nameof(form));
            var formValidation = await _validator.ValidateAsync(form);
            if (!formValidation.IsValid) return TypedResults.ValidationProblem(formValidation.Errors);


            var contactType = ValidationHelper.GetContactType(form.Username);
            var user = contactType switch
            {
                ContactType.Email => await _userManager.FindByEmailAsync(form.Username),
                ContactType.PhoneNumber => await _userManager.FindByPhoneNumberAsync(form.Username),
                _ => null
            };


            if (user is null) return TypedResults.ValidationProblem(new Dictionary<string, string[]>
            { { nameof(form.Username), [$"'{contactType.Humanize(LetterCasing.Sentence)}' does not exist."] } });

            if (!await _userManager.CheckPasswordAsync(user, form.Password)) return TypedResults.ValidationProblem(new Dictionary<string, string[]>
            { { nameof(form.Password), [$"'{nameof(form.Password).Humanize(LetterCasing.Sentence)}' is not correct."] } });

            if ((_userManager.Options.SignIn.RequireConfirmedEmail && !user.EmailConfirmed) ||
                (_userManager.Options.SignIn.RequireConfirmedPhoneNumber && !user.PhoneNumberConfirmed) ||
                (_userManager.Options.SignIn.RequireConfirmedAccount && (!user.EmailConfirmed && !user.PhoneNumberConfirmed))) return TypedResults.ValidationProblem(new Dictionary<string, string[]>
            { { nameof(form.Username), [$"'{contactType.Humanize(LetterCasing.Sentence)}' is not confirmed."] } }, extensions: new Dictionary<string, object?> { { "requiresConfirmation", true } });

            var model = await BuildUserWithTokenModelAsync(user);
            return TypedResults.Ok(model);
        }

        public async Task<Results<Ok<PrivateUserWithTokenModel>, ValidationProblem>> GenerateTokenFromExternalAuthenticationAsync(string provider)
        {
            if (string.IsNullOrEmpty(provider))
                return TypedResults.ValidationProblem(new Dictionary<string, string[]>(), title: $"No authentication provider was specified.");

            var externalLoginInfo = await _signInManager.GetExternalLoginInfoAsync();
            if (externalLoginInfo is null) return TypedResults.ValidationProblem(new Dictionary<string, string[]>(), title: "External authentication failed.");

            var username =
                (externalLoginInfo.Principal.FindFirstValue(ClaimTypes.Email) ??
                externalLoginInfo.Principal.FindFirstValue(ClaimTypes.MobilePhone) ??
                externalLoginInfo.Principal.FindFirstValue(ClaimTypes.OtherPhone) ??
                externalLoginInfo.Principal.FindFirstValue(ClaimTypes.HomePhone))!;

            var firstName = externalLoginInfo.Principal.FindFirstValue(ClaimTypes.GivenName) ?? string.Empty;
            var lastName = externalLoginInfo.Principal.FindFirstValue(ClaimTypes.Surname) ?? string.Empty;

            var contactType = ValidationHelper.GetContactType(username);

            var user = contactType switch
            {
                ContactType.Email => await _userManager.FindByEmailAsync(username),
                ContactType.PhoneNumber => await _userManager.FindByPhoneNumberAsync(username),
                _ => null
            };


            if (user is null)
            {
                user = new User();
                user.UserName = await GenerateUserNameAsync(firstName, lastName);
                user.Email = contactType == ContactType.Email ? username : null;
                user.PhoneNumber = contactType == ContactType.PhoneNumber ? username : null;
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


            var model = await BuildUserWithTokenModelAsync(user);
            return TypedResults.Ok(model);
        }

        public async Task<Results<ChallengeHttpResult, ValidationProblem>> ConfigureExternalAuthenticationAsync(string provider, string origin, string[] allowedOrigins)
        {
            await Task.CompletedTask;

            if (string.IsNullOrEmpty(provider))
                return TypedResults.ValidationProblem(new Dictionary<string, string[]>(), title: $"No authentication provider was specified.");

            if (string.IsNullOrEmpty(origin))
                return TypedResults.ValidationProblem(new Dictionary<string, string[]>(), title: $"No origin was specified.");

            provider = provider.Pascalize();

            if (!allowedOrigins.Any(origin => Uri.Compare(new Uri(origin, UriKind.Absolute), new Uri(origin), UriComponents.SchemeAndServer, UriFormat.UriEscaped, StringComparison.OrdinalIgnoreCase) == 0))
                return TypedResults.ValidationProblem(new Dictionary<string, string[]>(), title: $"The origin specified is not allowed.");

            // Request a redirect to the external sign-in provider.
            var properties = _signInManager.ConfigureExternalAuthenticationProperties(provider, origin);
            return TypedResults.Challenge(properties, new[] { provider });
        }

        public async Task<Results<Ok<PrivateUserWithTokenModel>, ValidationProblem>> RefreshTokenAsync(RefreshTokenForm form)
        {
            if (form is null) throw new ArgumentNullException(nameof(form));
            var formValidation = await _validator.ValidateAsync(form);
            if (!formValidation.IsValid) return TypedResults.ValidationProblem(formValidation.Errors);


            var user = await _jwtTokenManager.FindUserByTokenAsync(form.Token);
            if (user is null) return TypedResults.ValidationProblem(new Dictionary<string, string[]>
            { { nameof(form.Token), [$"'{nameof(form.Token).Humanize(LetterCasing.Sentence)}' is not valid."] } });


            var model = await BuildUserWithTokenModelAsync(user, form.Token);
            return TypedResults.Ok(model);
        }

        public async Task<Results<Ok, ValidationProblem>> RevokeTokenAsync(RevokeTokenForm form)
        {
            if (form is null) throw new ArgumentNullException(nameof(form));
            var formValidation = await _validator.ValidateAsync(form);
            if (!formValidation.IsValid) return TypedResults.ValidationProblem(formValidation.Errors);


            var user = await _jwtTokenManager.FindUserByTokenAsync(form.Token);
            if (user is null) return TypedResults.ValidationProblem(new Dictionary<string, string[]>
            { { nameof(form.Token), [$"'{nameof(form.Token).Humanize(LetterCasing.Sentence)}' is not valid."] } });


            await _jwtTokenManager.InvalidateAsync(user, form.Token);
            return TypedResults.Ok();
        }

        public async Task<Results<Ok, Ok<PrivateUserWithTokenModel>, ValidationProblem>> ConfirmAccountAsync(ConfirmAccountForm form)
        {
            if (form is null) throw new ArgumentNullException(nameof(form));
            var formValidation = await _validator.ValidateAsync(form);
            if (!formValidation.IsValid) return TypedResults.ValidationProblem(formValidation.Errors);


            var contactType = ValidationHelper.GetContactType(form.Username);
            var user = contactType switch
            {
                ContactType.Email => await _userManager.FindByEmailAsync(form.Username),
                ContactType.PhoneNumber => await _userManager.FindByPhoneNumberAsync(form.Username),
                _ => null
            };


            if (user is null) return TypedResults.ValidationProblem(new Dictionary<string, string[]>
            { { nameof(form.Username), [$"'{contactType.Humanize(LetterCasing.Sentence)}' does not exist."] } });


            if (form.SendCode)
            {
                if (contactType == ContactType.Email)
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
                else if (contactType == ContactType.PhoneNumber)
                {
                    var code = await _userManager.GenerateChangePhoneNumberTokenAsync(user, form.Username);

                    var message = new TextMessage
                    {
                        Body = await _viewRenderer.RenderAsync("/Templates/Text/ConfirmAccount", (user, code)),
                        Recipients = new[] { form.Username }
                    };

                    await _smsSender.SendAsync(message);
                }

                return TypedResults.Ok();
            }

            var result = contactType switch
            {
                ContactType.Email => await _userManager.ChangeEmailAsync(user, form.Username, form.Code),
                ContactType.PhoneNumber => await _userManager.ChangePhoneNumberAsync(user, form.Username, form.Code),
                _ => throw new InvalidOperationException()
            };

            if (!result.Succeeded) return TypedResults.ValidationProblem(new Dictionary<string, string[]>
            { { nameof(form.Code), [$"'{nameof(form.Code).Humanize(LetterCasing.Sentence)}' is not valid."] } });

            var model = await BuildUserWithTokenModelAsync(user);
            return TypedResults.Ok(model);
        }

        public async Task<Results<Ok, Ok<PrivateUserWithTokenModel>, ValidationProblem, UnauthorizedHttpResult>> UpdateAccountAsync<TChangeAccountForm>(TChangeAccountForm form)
            where TChangeAccountForm : ChangeAccountForm
        {
            if (form is null) throw new ArgumentNullException(nameof(form));
            var formValidation = await _validator.ValidateAsync(form);
            if (!formValidation.IsValid) return TypedResults.ValidationProblem(formValidation.Errors);

            var contactType = form switch
            {
                ChangeEmailForm _ => ContactType.Email,
                ChangePhoneNumberForm _ => ContactType.PhoneNumber,
                _ => throw new InvalidOperationException("Unsupported form type for determining contact type.")
            };

            var currentUser = await _userContext.GetUserAsync();
            if (currentUser is null) return TypedResults.Unauthorized();

            if (form.SendCode)
            {
                if (contactType == ContactType.Email)
                {
                    var code = await _userManager.GenerateChangeEmailTokenAsync(currentUser, form.NewUsername);

                    var message = new EmailMessage
                    {
                        Subject = "Change Your Email Address",
                        Body = await _viewRenderer.RenderAsync("/Templates/Email/ChangeAccount", (currentUser, code)),
                        Recipients = new[] { form.CurrentUsername }
                    };

                    await _emailSender.SendAsync(message);
                }
                else if (contactType == ContactType.PhoneNumber)
                {
                    var code = await _userManager.GenerateChangePhoneNumberTokenAsync(currentUser, form.NewUsername);

                    var message = new TextMessage
                    {
                        Body = await _viewRenderer.RenderAsync("/Templates/Text/ChangeAccount", (currentUser, code)),
                        Recipients = new[] { form.CurrentUsername }
                    };

                    await _smsSender.SendAsync(message);
                }

                return TypedResults.Ok();
            }

            var result = contactType switch
            {
                ContactType.Email => await _userManager.ChangeEmailAsync(currentUser, form.NewUsername, form.Code),
                ContactType.PhoneNumber => await _userManager.ChangePhoneNumberAsync(currentUser, form.NewUsername, form.Code),
                _ => throw new InvalidOperationException()
            };

            if (!result.Succeeded) return TypedResults.ValidationProblem(new Dictionary<string, string[]>
            { { nameof(form.Code), [$"'{nameof(form.Code).Humanize(LetterCasing.Sentence)}' is not valid."] } });

            var model = await BuildUserWithTokenModelAsync(currentUser);
            return TypedResults.Ok(model);
        }

        public async Task<Results<Ok, ValidationProblem>> ResetPasswordAsync(ResetPasswordForm form)
        {
            if (form is null) throw new ArgumentNullException(nameof(form));
            var formValidation = await _validator.ValidateAsync(form);
            if (!formValidation.IsValid) return TypedResults.ValidationProblem(formValidation.Errors);


            var contactType = ValidationHelper.GetContactType(form.Username);
            var user = contactType switch
            {
                ContactType.Email => await _userManager.FindByEmailAsync(form.Username),
                ContactType.PhoneNumber => await _userManager.FindByPhoneNumberAsync(form.Username),
                _ => null
            };


            if (user is null) return TypedResults.ValidationProblem(new Dictionary<string, string[]>
            { { nameof(form.Username), [$"'{contactType.Humanize(LetterCasing.Sentence)}' does not exist."] } });


            if (form.SendCode)
            {
                var code = await _userManager.GeneratePasswordResetTokenAsync(user);

                if (contactType == ContactType.Email)
                {
                    var message = new EmailMessage
                    {
                        Subject = "Reset Your Password",
                        Body = await _viewRenderer.RenderAsync("/Templates/Email/ResetPassword", (user, code)),
                        Recipients = new[] { form.Username }
                    };

                    await _emailSender.SendAsync(message);
                }
                else if (contactType == ContactType.PhoneNumber)
                {
                    var message = new TextMessage
                    {
                        Body = await _viewRenderer.RenderAsync("/Templates/Text/ResetPassword", (user, code)),
                        Recipients = new[] { form.Username }
                    };

                    await _smsSender.SendAsync(message);
                }

                return TypedResults.Ok();
            }

            var result = await _userManager.ResetPasswordAsync(user, form.Code, form.NewPassword);
            if (!result.Succeeded) return TypedResults.ValidationProblem(new Dictionary<string, string[]>
            { { nameof(form.Code), [$"'{nameof(form.Code).Humanize(LetterCasing.Sentence)}' is not valid."] } });

            return TypedResults.Ok();
        }

        public async Task<Results<Ok, ValidationProblem, UnauthorizedHttpResult>> CreatePasswordAsync(CreatePasswordForm form)
        {
            if (form is null) throw new ArgumentNullException(nameof(form));
            var formValidation = await _validator.ValidateAsync(form);
            if (!formValidation.IsValid) return TypedResults.ValidationProblem(formValidation.Errors);

            var currentUser = await _userContext.GetUserAsync();
            if (currentUser is null) return TypedResults.Unauthorized();

            var result = await _userManager.AddPasswordAsync(currentUser, form.NewPassword);

            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    if (error.Code == "UserAlreadyHasPassword")
                        return TypedResults.ValidationProblem(new Dictionary<string, string[]>(), title: "User already has a password.");
                }

                return TypedResults.ValidationProblem(new Dictionary<string, string[]>(), title: "Unable to create password.");

            }

            currentUser.HasPassword = true;
            await _userManager.UpdateAsync(currentUser);

            return TypedResults.Ok();
        }

        public async Task<Results<Ok, ValidationProblem, UnauthorizedHttpResult>> ChangePasswordAsync(ChangePasswordForm form)
        {
            if (form is null) throw new ArgumentNullException(nameof(form));
            var formValidation = await _validator.ValidateAsync(form);
            if (!formValidation.IsValid) return TypedResults.ValidationProblem(formValidation.Errors);

            var currentUser = await _userContext.GetUserAsync();
            if (currentUser is null) return TypedResults.Unauthorized();

            var result = await _userManager.ChangePasswordAsync(currentUser, form.CurrentPassword, form.NewPassword);
            if (!result.Succeeded)
            {
                var errors = new Dictionary<string, string[]>();

                foreach (var error in result.Errors)
                {
                    if (error.Code == "PasswordMismatch") errors.Add(nameof(form.CurrentPassword), new[] { $"'{nameof(form.CurrentPassword).Humanize(LetterCasing.Sentence)}' is not correct." });
                }

                return TypedResults.ValidationProblem(errors, title: "Unable to change password.");

            }
            return TypedResults.Ok();
        }

        public async Task<Results<Ok<PrivateUserModel>, ValidationProblem, UnauthorizedHttpResult>> EditProfileAsync(EditProfileForm form)
        {
            if (form is null) throw new ArgumentNullException(nameof(form));
            var formValidation = await _validator.ValidateAsync(form);
            if (!formValidation.IsValid) return TypedResults.ValidationProblem(formValidation.Errors);

            var currentUser = await _userContext.GetUserAsync();
            if (currentUser is null) return TypedResults.Unauthorized();

            currentUser = _mapper.Map(form, currentUser);
            currentUser.UpdatedAt = DateTimeOffset.UtcNow;

            await _userManager.UpdateAsync(currentUser);

            var model = await BuildUserModelAsync(currentUser);
            return TypedResults.Ok(model);
        }

        public async Task<Results<ContentHttpResult, NotFound, ValidationProblem, UnauthorizedHttpResult, ForbidHttpResult, StatusCodeHttpResult>> UploadProfileImageAsync(UploadProfileImageForm form)
        {
            if (form is null) throw new ArgumentNullException(nameof(form));
            var formValidation = await _validator.ValidateAsync(form);
            if (!formValidation.IsValid) return TypedResults.ValidationProblem(formValidation.Errors);

            var status = await _fileStorage.WriteAsync(form.Path, form.Chunk, form.Length, form.Offset);

            if (status == FileWriteStatus.Started || status == FileWriteStatus.Completed)
            {
                var currentUser = await _userContext.GetUserAsync();
                if (currentUser is null) return TypedResults.Unauthorized();


                if (status == FileWriteStatus.Completed)
                {
                    var source = await _fileStorage.ReadAsync(form.Path);
                    if (source is null) return TypedResults.StatusCode(StatusCodes.Status424FailedDependency);

                    await _imageProcessor.ScaleAsync(source, _identityServiceOptions.Value.ProfileImageScaleWidth);
                }
            }

            return TypedResults.Content(form.Path);
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

        private async Task<PrivateUserModel> BuildUserModelAsync(User user)
        {
            if (user is null) throw new ArgumentNullException(nameof(user));

            var model = _mapper.Map<PrivateUserModel>(user);

            var roles = (await _userManager.GetRolesAsync(user)).ToArray();
            model.Roles = roles.Select(_ => _.Camelize()).ToArray();
            model.Title = user.GetTitle(roles);
            model.ImageUrl = user.ImageId is not null ? _fileStorage.GetUrl(user.ImageId) : null;
            return model;
        }

        private async Task<PrivateUserWithTokenModel> BuildUserWithTokenModelAsync(User user, string? token = null)
        {
            if (user is null) throw new ArgumentNullException(nameof(user));

            if (token is not null) await _jwtTokenManager.InvalidateAsync(user, token);

            var tokenInfo = await _jwtTokenManager.GenerateAsync(user);
            var model = _mapper.Map(user, _mapper.Map<PrivateUserWithTokenModel>(tokenInfo));

            var roles = (await _userManager.GetRolesAsync(user)).ToArray();
            model.Roles = roles.Select(_ => _.Camelize()).ToArray();
            model.Title = user.GetTitle(roles);
            model.ImageUrl = user.ImageId is not null ? _fileStorage.GetUrl(user.ImageId) : null;
            return model;
        }
    }

    public interface IIdentityService
    {
        Task<Results<Ok<PrivateUserWithTokenModel>, ValidationProblem>> RegisterAccountAsync(RegisterAccountForm form);

        Task<Results<Ok<PrivateUserWithTokenModel>, ValidationProblem>> GenerateTokenAsync(GenerateTokenForm form);

        Task<Results<Ok<PrivateUserWithTokenModel>, ValidationProblem>> GenerateTokenFromExternalAuthenticationAsync(string provider);

        Task<Results<ChallengeHttpResult, ValidationProblem>> ConfigureExternalAuthenticationAsync(string provider, string returnUrl, string[] allowedOrigins);

        Task<Results<Ok<PrivateUserWithTokenModel>, ValidationProblem>> RefreshTokenAsync(RefreshTokenForm form);

        Task<Results<Ok, ValidationProblem>> RevokeTokenAsync(RevokeTokenForm form);

        Task<Results<Ok, Ok<PrivateUserWithTokenModel>, ValidationProblem>> ConfirmAccountAsync(ConfirmAccountForm form);

        Task<Results<Ok, Ok<PrivateUserWithTokenModel>, ValidationProblem, UnauthorizedHttpResult>> UpdateAccountAsync<TChangeAccountForm>(TChangeAccountForm form)
            where TChangeAccountForm : ChangeAccountForm;

        Task<Results<Ok, ValidationProblem>> ResetPasswordAsync(ResetPasswordForm form);

        Task<Results<Ok, ValidationProblem, UnauthorizedHttpResult>> CreatePasswordAsync(CreatePasswordForm form);

        Task<Results<Ok, ValidationProblem, UnauthorizedHttpResult>> ChangePasswordAsync(ChangePasswordForm form);

        Task<Results<Ok<PrivateUserModel>, ValidationProblem, UnauthorizedHttpResult>> EditProfileAsync(EditProfileForm form);

        Task<Results<ContentHttpResult, NotFound, ValidationProblem, UnauthorizedHttpResult, ForbidHttpResult, StatusCodeHttpResult>> UploadProfileImageAsync(UploadProfileImageForm form);
    }

    public class IdentityServiceOptions
    {
        public int ProfileImageScaleWidth { get; set; }

        public string[] ProfileImageFileExtensions { get; set; } = Array.Empty<string>();

        public long ProfileImageFileMaxSize { get; set; }

    }

    public static class IdentityServiceExtensions
    {
        public static IServiceCollection AddIdentityService(this IServiceCollection services, Action<IdentityServiceOptions>? configure = null)
        {
            if (configure is not null) services.Configure(configure);
            services.AddScoped<IIdentityService, IdentityService>();
            return services;
        }
    }
}