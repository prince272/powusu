using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using POwusu.Server.Entities.Identity;
using System.Security.Claims;

namespace POwusu.Server.Extensions.Identity
{
    public static class IdentityExtensions
    {
        public static Task<User?> FindByPhoneNumberAsync(this UserManager<User> userManager, string phoneNumber)
        {
            if (userManager is null) throw new ArgumentNullException(nameof(userManager));
            if (phoneNumber is null) throw new ArgumentNullException(nameof(phoneNumber));

            return userManager.Users.FirstOrDefaultAsync(_ => _.PhoneNumber == phoneNumber);
        }

        public static string? GetSecurityStamp(this UserManager<User> userManager, ClaimsPrincipal principal)
        {
            if (userManager is null) throw new ArgumentNullException(nameof(userManager));
            if (principal is null) throw new ArgumentNullException(nameof(principal));
            return principal.FindFirst(userManager.Options.ClaimsIdentity.SecurityStampClaimType) is Claim claim ? claim.Value : null;
        }

        public static string GetMessage(this IEnumerable<IdentityError> errors)
        {
            if (errors is null) throw new ArgumentNullException(nameof(errors));
            return "Operation failed: " + string.Join(string.Empty, errors.Select(x => $"{Environment.NewLine} -- {x.Code}: {x.Description}"));
        }

        public static async Task<User> UpdateAsync(this UserManager<User> userManager, User user, DateTimeOffset lastActiveAt, CancellationToken cancellationToken = default)
        {
            if (userManager is null) throw new ArgumentNullException(nameof(userManager));
            if (user is null) throw new ArgumentNullException(nameof(user));

            // Update the LastActive of a user only if at least 59 seconds has elapsed since the last update.
            var threshold = TimeSpan.FromSeconds(59);

            if (lastActiveAt - user.LastActiveAt >= threshold)
            {
                user.LastActiveAt = lastActiveAt;
                await userManager.UpdateAsync(user);
            }

            return user;
        }
    }
}
