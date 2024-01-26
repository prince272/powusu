namespace POwusu.Server.Extensions.ImageProcessor
{
    public static class ImageSharpExtensions
    {
        public static IServiceCollection AddImageProcessor(this IServiceCollection services)
        {
            services.AddTransient<IImageProcessor, ImageSharpProcessor>();
            return services;
        }
    }
}
