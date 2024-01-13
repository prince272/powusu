﻿using POwusu.Server.Extensions.FileStorage;

namespace POwusu.Server.Extensions.FileStorage.Local
{
    public static class LocalFileStorageExtensions
    {
        public static IServiceCollection AddLocalFileStorage(this IServiceCollection services, Action<LocalFileStorageOptions> options)
        {
            services.Configure(options);
            services.AddLocalFileStorage();
            return services;
        }

        public static IServiceCollection AddLocalFileStorage(this IServiceCollection services)
        {
            services.AddTransient<IFileStorage, LocalFileStorage>();
            return services;
        }
    }
}
