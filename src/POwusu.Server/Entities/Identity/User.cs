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

        public string FirstName { get; set; } = null!;

        public string LastName { get; set; } = null!;

        public DateTimeOffset CreatedAt { get; set; }

        public DateTimeOffset? UpdatedAt { get; set; }

        public DateTimeOffset? LastActiveAt { get; set; }

        public virtual ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
    }
    
    public class UserRole : IdentityUserRole<string>
    {
        public virtual User User { get; set; } = null!;


        public virtual Role Role { get; set; } = null!;
    }
}
