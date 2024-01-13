using Humanizer;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Reflection;

namespace POwusu.Server.Options
{
    public class ConfigureSwaggerGenOptions : IConfigureOptions<SwaggerGenOptions>
    {
        public void Configure(SwaggerGenOptions options)
        {
            var assembly = Assembly.GetExecutingAssembly();

            options.OperationFilter<CamelizeParameOperationFilter>();

            options.SwaggerDoc("v1", new OpenApiInfo
            {
                Version = "v1",
                Title = assembly.GetName().Name,
                Description = "An ASP.NET Core Web API for managing ToDo items",
                TermsOfService = new Uri("https://example.com/terms"),
                Contact = new OpenApiContact
                {
                    Name = "Example Contact",
                    Url = new Uri("https://example.com/contact")
                },
                License = new OpenApiLicense
                {
                    Name = "Example License",
                    Url = new Uri("https://example.com/license")
                }
            });

            options.AddSecurityDefinition(JwtBearerDefaults.AuthenticationScheme, new OpenApiSecurityScheme
            {
                In = ParameterLocation.Header,
                Description = "\"Standard Authorization header using the Bearer scheme (JWT). Example: \\\"Bearer {token}\\\"\"",
                Name = "Authorization",
                Type = SecuritySchemeType.Http,
                BearerFormat = "JWT",
                Scheme = JwtBearerDefaults.AuthenticationScheme
            });
            options.AddSecurityRequirement(new OpenApiSecurityRequirement
        {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = JwtBearerDefaults.AuthenticationScheme
                }
            }, Array.Empty<string>()
        }
        });

            options.TagActionsBy(desc =>
            {
                var rootSegment = desc.RelativePath?.Split(new[] { '/' }, StringSplitOptions.RemoveEmptyEntries).FirstOrDefault()?.Titleize() ?? "Home";
                return new List<string> { rootSegment! }.SkipWhile(string.IsNullOrWhiteSpace).ToArray();
            });

            var xmlFilePath = Path.Combine(AppContext.BaseDirectory, $"{assembly.GetName().Name}.xml");
            if (File.Exists(xmlFilePath)) options.IncludeXmlComments(xmlFilePath);
        }

        public class CamelizeParameOperationFilter : IOperationFilter
        {
            public void Apply(OpenApiOperation operation, OperationFilterContext context)
            {
                if (operation.Parameters == null) operation.Parameters = new List<OpenApiParameter>();
                else
                {
                    foreach (var item in operation.Parameters.Where(_ => _.In == ParameterLocation.Query))
                    {
                        item.Name = item.Name.Camelize();
                    }
                }
            }
        }
    }
}