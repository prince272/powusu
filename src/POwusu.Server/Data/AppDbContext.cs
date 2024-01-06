using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using POwusu.Server.Entities.Identity;

namespace POwusu.Server.Data
{
    public class AppDbContext : IdentityDbContext<User, Role, string, 
        IdentityUserClaim<string>, UserRole, IdentityUserLogin<string>, 
        IdentityRoleClaim<string>, IdentityUserToken<string>>
    {
        public AppDbContext()
        {
        }

        public AppDbContext(DbContextOptions options) : base(options)
        {
        }
    }
}