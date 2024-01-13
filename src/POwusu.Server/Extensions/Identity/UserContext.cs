using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using POwusu.Server.Data;
using POwusu.Server.Entities.Identity;
using POwusu.Server.Extensions.Anonymous;

namespace POwusu.Server.Extensions.Identity
{
    public class UserContext : IUserContext
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly UserManager<User> _userManager;
        private readonly AppDbContext _appDbContext;

        public UserContext(IHttpContextAccessor httpContextAccessor, UserManager<User> userManager, AppDbContext appDbContext)
        {
            _httpContextAccessor = httpContextAccessor;
            _userManager = userManager;
            _appDbContext = appDbContext;
        }

        public string? UserAgent
        {
            get
            {
                var userAgent = _httpContextAccessor.HttpContext?.Request.Headers.UserAgent;
                return !string.IsNullOrEmpty(userAgent) ? userAgent : null;
            }
        }

        public string? UserId
        {
            get
            {
                var user = _httpContextAccessor?.HttpContext?.User;
                if (user == null) return null;
                var userId = _userManager.GetUserId(user);
                return !string.IsNullOrEmpty(userId) ? userId : null;
            }
        }

        public string? AnonymousId
        {
            get
            {
                var feature = _httpContextAccessor?.HttpContext?.Features.Get<IAnonymousIdFeature>();
                return feature?.AnonymousId;
            }
        }

        public async Task<User?> GetUserAsync()
        {
            var userId = UserId;
            if (userId == null) return null;
            var user = await _userManager.FindByIdAsync(userId);

            if (user is not null)
            {
                await _appDbContext.Users.Include(u => u.UserRoles).ThenInclude(ur => ur.Role).Where(u => u.Id == userId).LoadAsync();

            }

            return user;
        }
    }
}