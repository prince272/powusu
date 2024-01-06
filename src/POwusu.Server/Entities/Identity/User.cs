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
    }
    
    public class UserRole : IdentityUserRole<string>
    {
        public virtual User User { get; set; } = null!;


        public virtual Role Role { get; set; } = null!;
    }
}
