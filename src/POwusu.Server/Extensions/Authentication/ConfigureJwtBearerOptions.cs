using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using POwusu.Server.Entities.Identity;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace POwusu.Server.Extensions.Authentication
{
    public class ConfigureJwtBearerOptions : IConfigureOptions<JwtBearerOptions>
    {
        private readonly IOptions<JwtTokenOptions> _jwtTokenOptions;

        public ConfigureJwtBearerOptions(IOptions<JwtTokenOptions> jwtTokenOptions)
        {
            _jwtTokenOptions = jwtTokenOptions;
        }

        public void Configure(JwtBearerOptions options)
        {
            options.RequireHttpsMetadata = false;
            options.SaveToken = true;
            options.TokenValidationParameters ??= new TokenValidationParameters();
            options.TokenValidationParameters.ValidateIssuer = true;
            options.TokenValidationParameters.ValidIssuers = _jwtTokenOptions.Value.Issuer.Split(";", StringSplitOptions.RemoveEmptyEntries).ToArray();
            options.TokenValidationParameters.ValidateAudience = true;
            options.TokenValidationParameters.ValidAudiences = _jwtTokenOptions.Value.Audience.Split(";", StringSplitOptions.RemoveEmptyEntries).ToArray();
            options.TokenValidationParameters.ValidateLifetime = true;
            options.TokenValidationParameters.ValidateIssuerSigningKey = true;
            options.TokenValidationParameters.IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtTokenOptions.Value.Secret));

            options.TokenValidationParameters.ClockSkew = TimeSpan.Zero;

            options.Events = new JwtBearerEvents
            {
                OnAuthenticationFailed = context =>
                {
                    var logger = context.HttpContext.RequestServices.GetRequiredService<ILoggerFactory>().CreateLogger(nameof(JwtBearerEvents));
                    logger.LogError(context.Exception, $"JWT Authentication failed");
                    return Task.CompletedTask;
                },
                OnTokenValidated = async context =>
                {
                    var userManager = context.HttpContext.RequestServices.GetRequiredService<UserManager<User>>();
                    var jwtTokenManager = context.HttpContext.RequestServices.GetRequiredService<IJwtTokenManager>();

                    var claimsPrincipal = context.Principal;

                    if (claimsPrincipal?.Claims == null || !claimsPrincipal.Claims.Any())
                    {
                        context.Fail("This is not our issued token. It has no claims.");
                        return;
                    }

                    var userId = userManager.GetUserId(claimsPrincipal);
                    var user = !string.IsNullOrEmpty(userId) ? await userManager.FindByIdAsync(userId) : null;

                    var securityStamp = userManager.GetSecurityStamp(claimsPrincipal);

                    if (user == null || !string.Equals(user.SecurityStamp, securityStamp, StringComparison.Ordinal))
                    {
                        // user has changed his/her password/roles/active
                        context.Fail("This token is expired. Please login again.");
                        return;
                    }


                    if (context.SecurityToken is not JwtSecurityToken accessToken || string.IsNullOrWhiteSpace(accessToken.RawData) ||
                        !await jwtTokenManager.ValidateAsync(accessToken.RawData))
                    {
                        context.Fail("This token is not in our database.");
                        return;
                    }

                    await userManager.UpdateAsync(user, lastActiveAt: DateTimeOffset.UtcNow);
                },
                OnMessageReceived = context =>
                {
                    var accessToken = context.Request.Query["access_token"];
                    var path = context.HttpContext.Request.Path;

                    if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/signalr"))
                    {
                        context.Token = accessToken;
                    }

                    return Task.CompletedTask;
                },
                OnChallenge = context =>
                {
                    var logger = context.HttpContext.RequestServices.GetRequiredService<ILoggerFactory>().CreateLogger(nameof(JwtBearerEvents));
                    logger.LogError($"OnChallenge error {context.Error}, {context.ErrorDescription}");
                    return Task.CompletedTask;
                },
            };
        }
    }
}
