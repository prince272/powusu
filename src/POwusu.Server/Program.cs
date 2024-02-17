using FluentValidation;
using Humanizer;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using POwusu.Server.Data;
using POwusu.Server.Entities.Identity;
using POwusu.Server.Extensions.Anonymous;
using POwusu.Server.Extensions.EmailSender;
using POwusu.Server.Extensions.FileStorage;
using POwusu.Server.Extensions.Identity;
using POwusu.Server.Extensions.ImageProcessor;
using POwusu.Server.Extensions.MessageSender;
using POwusu.Server.Extensions.Routing;
using POwusu.Server.Extensions.Validation;
using POwusu.Server.Extensions.ViewRenderer;
using POwusu.Server.Hubs;
using POwusu.Server.Middlewares;
using POwusu.Server.Options;
using POwusu.Server.Services;
using Serilog;
using Serilog.Settings.Configuration;
using System.Reflection;
using System.Security.Claims;
using System.Text.Json;
using System.Text.Json.Serialization;
using IValidator = POwusu.Server.Extensions.Validation.IValidator;

try
{
    Log.Information("Starting web application...");

    var builder = WebApplication.CreateBuilder(args);

    Log.Logger = new LoggerConfiguration().ReadFrom.Configuration(builder.Configuration,
        new ConfigurationReaderOptions { SectionName = "SerilogOptions" }).Enrich.FromLogContext().CreateLogger();

    builder.Logging.ClearProviders();
    builder.Host.UseSerilog(Log.Logger);

    // Configure options to the container.

    ValidatorOptions.Global.DefaultClassLevelCascadeMode = CascadeMode.Continue;
    ValidatorOptions.Global.DefaultRuleLevelCascadeMode = CascadeMode.Stop;
    ValidatorOptions.Global.DisplayNameResolver = (type, memberInfo, expression) =>
    {
        string? RelovePropertyName()
        {
            if (expression != null)
            {
                var chain = FluentValidation.Internal.PropertyChain.FromExpression(expression);
                if (chain.Count > 0) return chain.ToString();
            }

            if (memberInfo != null)
            {
                return memberInfo.Name;
            }

            return null;
        }

        return RelovePropertyName()?.Humanize();
    };

    builder.Services.ConfigureHttpJsonOptions(options =>
    {
        options.SerializerOptions.DictionaryKeyPolicy = JsonNamingPolicy.CamelCase;
        options.SerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;

        options.SerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.SerializerOptions.Converters.Add(new JsonStringEnumConverter(JsonNamingPolicy.CamelCase));

        options.SerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.Never;
    });

    builder.Services.AddDbContext<AppDbContext>(options =>
    {
        options.UseSqlite(builder.Configuration.GetConnectionString("Application"));
    });

    builder.Services.AddIdentity<User, Role>(options =>
    {
        // Password settings. (Will be using fluent validation)
        options.Password.RequireDigit = false;
        options.Password.RequireLowercase = false;
        options.Password.RequireNonAlphanumeric = false;
        options.Password.RequireUppercase = false;
        options.Password.RequiredLength = 0;
        options.Password.RequiredUniqueChars = 0;

        // Lockout settings.
        options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
        options.Lockout.MaxFailedAccessAttempts = 5;
        options.Lockout.AllowedForNewUsers = true;

        // User settings.
        options.User.AllowedUserNameCharacters = string.Empty;
        options.User.RequireUniqueEmail = false;

        options.SignIn.RequireConfirmedAccount = false;
        options.SignIn.RequireConfirmedEmail = true;
        options.SignIn.RequireConfirmedPhoneNumber = false;

        // Generate Short Code for Email Confirmation using Asp.Net Identity core 2.1
        // source: https://stackoverflow.com/questions/53616142/generate-short-code-for-email-confirmation-using-asp-net-identity-core-2-1
        options.Tokens.EmailConfirmationTokenProvider = TokenOptions.DefaultEmailProvider;
        options.Tokens.ChangeEmailTokenProvider = TokenOptions.DefaultEmailProvider;
        options.Tokens.PasswordResetTokenProvider = TokenOptions.DefaultEmailProvider;

        options.ClaimsIdentity.RoleClaimType = ClaimTypes.Role;
        options.ClaimsIdentity.UserNameClaimType = ClaimTypes.Name;
        options.ClaimsIdentity.UserIdClaimType = ClaimTypes.NameIdentifier;
        options.ClaimsIdentity.EmailClaimType = ClaimTypes.Email;
        options.ClaimsIdentity.SecurityStampClaimType = ClaimTypes.SerialNumber;
    })
        .AddEntityFrameworkStores<AppDbContext>()
        .AddDefaultTokenProviders()
        .AddClaimsPrincipalFactory<UserClaimsPrincipalFactory>();


    builder.Services.ConfigureOptions<ConfigureJwtBearerOptions>();

    builder.Services.ConfigureOptions<ConfigureJwtTokenOptions>();

    builder.Services.AddJwtTokenManager();

    builder.Services.AddAuthentication(options =>
    {
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultSignInScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;

    })
        .AddJwtBearer()
        .AddGoogle(GoogleDefaults.AuthenticationScheme, options =>
        {
            options.SignInScheme = IdentityConstants.ExternalScheme;

            builder.Configuration.GetRequiredSection("AuthenticationOptions:Google").Bind(options);
        });

    // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
    builder.Services.ConfigureOptions<ConfigureSwaggerGenOptions>();

    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();

    builder.Services.AddCors(options =>
    {
        options.AddDefaultPolicy(policy =>
        {
            var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins")?.Get<string[]>() ?? Array.Empty<string>();

            policy
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials()
            .WithExposedHeaders("Content-Disposition")
            .SetPreflightMaxAge(TimeSpan.FromMinutes(10))
            .WithOrigins(allowedOrigins);
        });
    });

    builder.Services.AddSignalR();

    builder.Services.AddImageProcessor();

    builder.Services.AddMailKitEmailSender(options =>
    {
        builder.Configuration.GetRequiredSection("MailingOptions:MailKit").Bind(options);
    });

    builder.Services.AddFakeMessageSender(options =>
    {
        builder.Configuration.GetRequiredSection("MessagingOptions:FakeSms").Bind(options);
    });

    builder.Services.AddRazorViewRenderer();

    builder.Services.ConfigureOptions<ConfigureLocalFileStorageOptions>();
    builder.Services.AddLocalFileStorage();

    builder.Services.AddAutoMapper(Assembly.GetExecutingAssembly());
    
    builder.Services.AddValidators(Assembly.GetExecutingAssembly());

    builder.Services.AddMediatR(options => options.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));

    builder.Services.AddScoped<IUserContext, UserContext>();

    builder.Services.AddIdentityService(options =>
    {
        options.ProfileImageScaleWidth = 128;
        options.ProfileImageFileExtensions = new[] { ".jpg", ".jpeg", ".png" };
        options.ProfileImageFileMaxSize = 20971520; // 20MB
    });

    builder.Services.AddBlogService(options =>
    {
        options.PostImageScaleWidth = 512;
        options.PostImageFileExtensions = new[] { ".jpg", ".jpeg", ".png" };
        options.PostImageFileMaxSize = 20971520; // 20MB

    });

    builder.Services.AddEndpoints(Assembly.GetExecutingAssembly());

    builder.Services.AddHostedService<ProgramService>();

    var app = builder.Build();

    app.UseStatusCodePagesWithReExecute("/errors/{0}");
    app.UseExceptionHandler(new ExceptionHandlerOptions()
    {
        AllowStatusCode404Response = true,
        ExceptionHandler = null,
        ExceptionHandlingPath = "/errors/500"
    });

    // Configure the HTTP request pipeline.
    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }

    app.UseHttpsRedirection();

    app.UseCors();

    app.UseStaticFiles();

    app.UseAnonymousId();

    app.UseDbTransaction<AppDbContext>();

    app.MapEndpoints();

    app.MapHub<SignalRHub>("/signalr");

    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application terminated unexpectedly.");

    throw;
}
finally
{
    Log.CloseAndFlush();
}