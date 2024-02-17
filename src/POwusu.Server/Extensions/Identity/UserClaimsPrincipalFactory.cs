using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using POwusu.Server.Entities.Identity;
using System.Security.Claims;

namespace POwusu.Server.Extensions.Identity
{
    public class UserClaimsPrincipalFactory : UserClaimsPrincipalFactory<User, Role>
    {
        public UserClaimsPrincipalFactory(
            UserManager<User> userManager,
            RoleManager<Role> roleManager,
            IOptions<IdentityOptions> optionsAccessor) : base(userManager, roleManager, optionsAccessor)
        {
        }

        public async override Task<ClaimsPrincipal> CreateAsync(User user)
        {
            var principal = await base.CreateAsync(user);

            return principal;
        }
    }
}