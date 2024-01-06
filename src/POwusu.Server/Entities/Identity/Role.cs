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
    }
}
