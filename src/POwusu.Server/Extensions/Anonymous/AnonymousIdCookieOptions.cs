using Microsoft.AspNetCore.Http;

namespace POwusu.Server.Extensions.Anonymous
{
    public class AnonymousIdCookieOptions : CookieOptions
    {
        public string Name { get; set; } = null!;
        public bool SlidingExpiration { get; set; } = true;
        public int Timeout { get; set; }
    }
}