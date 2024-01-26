using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.Extensions.Options;
using MimeKit;
using POwusu.Server.Extensions.FileStorage;

namespace POwusu.Server.Options
{
    public class ConfigureLocalFileStorageOptions : IConfigureOptions<LocalFileStorageOptions>
    {
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ConfigureLocalFileStorageOptions(IWebHostEnvironment webHostEnvironment, IHttpContextAccessor httpContextAccessor)
        {
            _webHostEnvironment = webHostEnvironment;
            _httpContextAccessor = httpContextAccessor;
        }

        public void Configure(LocalFileStorageOptions options)
        {
            var httpContext = _httpContextAccessor?.HttpContext;
            if (httpContext == null) throw new InvalidOperationException("Unable to determine the current HttpContext.");

            options.RootPath = _webHostEnvironment.WebRootPath;
            options.RootUrl = string.Concat(httpContext.Request.Scheme, "://", httpContext.Request.Host.ToUriComponent());
        }
    }
}
