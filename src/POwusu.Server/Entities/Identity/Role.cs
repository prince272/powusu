using Microsoft.AspNetCore.Identity;

namespace POwusu.Server.Entities.Identity
{
    public class Role : IdentityRole
    {
        public Role()
        {
        }

        public Role(string roleName) : base(roleName)
        {
        }

        public virtual ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
    }

    public static class RoleNames
    {
        public static string Administrator { get; set; } = nameof(Administrator);

        public static string Member { get; set; } = nameof(Member);

        public static string[] All => new[] { Administrator, Member };
    }
}
