
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using POwusu.Server.Data;
using POwusu.Server.Entities.Identity;

namespace POwusu.Server.Services
{
    public class ProgramService : IHostedService
    {
        private readonly IServiceProvider _serviceProvider;

        public ProgramService(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            using var scope = _serviceProvider.CreateScope();
            var services = scope.ServiceProvider;

            var logger = services.GetRequiredService<ILogger<ProgramService>>();
            var environment = services.GetRequiredService<IWebHostEnvironment>();
            var roleManager = services.GetRequiredService<RoleManager<Role>>();
            try
            {
                logger.LogInformation("Start seeding the database.");

                // Ensure database is created.
                var dbContext = services.GetRequiredService<AppDbContext>();
                await dbContext.Database.EnsureCreatedAsync(cancellationToken);

                // Seed the database.

                if (!await roleManager.Roles.AnyAsync(cancellationToken))
                {
                    foreach (var roleName in RoleNames.All)
                        await roleManager.CreateAsync(new Role(roleName));
                }

                logger.LogInformation("Finished seeding the database.");
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "An error occurred while seeding the database.");
            }
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            return Task.CompletedTask;
        }
    }
}
