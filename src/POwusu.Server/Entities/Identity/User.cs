using Humanizer;
using Microsoft.AspNetCore.Identity;

namespace POwusu.Server.Entities.Identity
{
    public class User : IdentityUser
    {
        public User()
        {
        }

        public User(string userName) : base(userName)
        {
        }

        public bool HasPassword { get; set; }

        public string? ImageId { get; set; } = null!;

        public string? FullName
        {
            get
            {
                return FirstName is not null || LastName is not null ? $"{FirstName} {LastName}".Trim() : null;
            }
        }

        public string? FirstName { get; set; } = null!;

        public string? LastName { get; set; } = null!;

        public string? Bio { get; set; }

        public DateTimeOffset CreatedAt { get; set; }

        public DateTimeOffset? UpdatedAt { get; set; }

        public DateTimeOffset? LastActiveAt { get; set; }

        public bool InclusiveRoles(params string[] roles)
        {
            return roles.All(role => UserRoles.Any(userRole => string.Equals(userRole.Role.Name, role, StringComparison.OrdinalIgnoreCase)));
        }

        public bool ExclusiveRoles(params string[] roles)
        {
            return !roles.Any(role => UserRoles.Any(userRole => string.Equals(userRole.Role.Name, role, StringComparison.OrdinalIgnoreCase)));
        }

        public string GetTitle(params string[] roles)
        {
            return roles.Append(RoleNames.Member).OrderBy(value => Array.IndexOf(RoleNames.All, value)).Select(role => role.Pascalize()).ToArray().First();
        }

        public virtual ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
    }

    public class UserRole : IdentityUserRole<string>
    {
        public virtual User User { get; set; } = null!;


        public virtual Role Role { get; set; } = null!;
    }
}
