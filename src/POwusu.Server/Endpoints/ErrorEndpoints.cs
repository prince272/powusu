﻿using Microsoft.AspNetCore.Diagnostics;
using POwusu.Server.Extensions.Routing;
using System.Text;

namespace POwusu.Server.Endpoints
{
    public class ErrorEndpoints : IEndpoints
    {
        private readonly IWebHostEnvironment _environment;

        public ErrorEndpoints(IWebHostEnvironment environment)
        {
            _environment = environment;
        }

        public void Configure(IEndpointRouteBuilder builder)
        {
            builder = builder.MapGroup("/");

            builder.Map("errors/{statusCode}", (HttpContext httpContext, int statusCode) =>
            {
                var exceptionFeature = httpContext.Features.Get<IExceptionHandlerFeature>();
                var statusCodeFeature = httpContext.Features.Get<IStatusCodeReExecuteFeature>();

                string title = GetStatusTitle(statusCode);
                string detail = GetStatusDetails(statusCode);

                if (exceptionFeature is not null)
                {
                    var exceptionType = exceptionFeature.Error.GetType().FullName;
                    var exceptionDetails = GetExceptionDetails(exceptionFeature.Error);

                    var instance = exceptionFeature.Path;
                    var extensions = _environment.IsDevelopment() ? new Dictionary<string, object?>()
                    {
                        { nameof(exceptionType), exceptionFeature.Error.GetType().FullName },
                        { nameof(exceptionDetails), GetExceptionDetails(exceptionFeature.Error)}
                    } : null;

                    return Results.Problem(title: title, detail: detail, instance: instance, statusCode: statusCode, extensions: extensions);
                }
                else
                {
                    var instance = statusCodeFeature?.OriginalPath ?? httpContext.Request.Path;

                    return Results.Problem(title: title, detail: detail, instance: instance, statusCode: statusCode);
                }
            }).ExcludeFromDescription();

            builder.MapGet("errors/throw", () => Results.NotFound());
        }

        public static string GetStatusTitle(int statusCode)
        {
            if (statusCode >= 500 && statusCode < 600)
            {
                return statusCode switch
                {
                    500 => "Internal server occurred",
                    501 => "Server doesn't support this feature",
                    502 => "Invalid response from another server",
                    503 => "Server currently unreachable",
                    504 => "Communication timeout between servers",
                    505 => "Server doesn't support requested HTTP version",
                    _ => "Unexpected server error occurred",
                };
            }
            else if (statusCode >= 400 && statusCode < 500)
            {
                return statusCode switch
                {
                    400 => "Invalid or malformed request",
                    401 => "Authentication required",
                    403 => "Access to resource forbidden",
                    404 => "Requested resource not found",
                    405 => "Requested method not supported",
                    406 => "Requested representation not acceptable",
                    407 => "Proxy requires authentication",
                    408 => "Server waiting time expired",
                    409 => "Request conflicts with current state",
                    410 => "Requested resource no longer available",
                    411 => "Content length not specified",
                    412 => "Request preconditions not met",
                    413 => "Request payload exceeds limit",
                    414 => "Request URI exceeds limit",
                    415 => "Unsupported request content type",
                    _ => "Unexpected client error occurred",
                };
            }
            else
            {
                return $"Unexpected status code: {statusCode}";
            }
        }


        public static string GetExceptionDetails(Exception exception)
        {
            if (exception is null) throw new ArgumentNullException(nameof(exception));

            var sb = new StringBuilder();
            sb.AppendLine("Exception Details:");
            sb.AppendLine($"Type: {exception.GetType().FullName}");
            sb.AppendLine($"Message: {exception.Message}");
            sb.AppendLine($"Source: {exception.Source}");
            sb.AppendLine($"TargetSite: {exception.TargetSite}");
            sb.AppendLine($"StackTrace: {exception.StackTrace}");

            if (exception.InnerException != null)
            {
                sb.AppendLine();
                sb.AppendLine("Inner Exception Details:");
                sb.AppendLine($"Type: {exception.InnerException.GetType().FullName}");
                sb.AppendLine($"Message: {exception.InnerException.Message}");
                sb.AppendLine($"Source: {exception.InnerException.Source}");
                sb.AppendLine($"TargetSite: {exception.InnerException.TargetSite}");
                sb.AppendLine($"StackTrace: {exception.InnerException.StackTrace}");
            }

            return sb.ToString();
        }

        public static string GetStatusDetails(int statusCode)
        {
            Dictionary<int, string> details = new()
            {
            // 1xx: Informational
            { 100, "The server received your request headers. Proceed to send the request body." },
            { 101, "The server is switching protocols as requested." },
            { 103, "The server hints early responses while preparing a full response." },

            // 2xx: Successful
            { 200, "Your request is successful." },
            { 201, "Your request has been fulfilled. A new resource is created." },
            { 202, "Your request accepted for processing, but not completed yet." },
            { 203, "Your request processed successfully, but response from another source." },
            { 204, "Your request processed successfully, but not returning any content." },
            { 205, "Your request processed successfully, and you need to reset the document view." },
            { 206, "The server is delivering only part of the resource due to a range header sent by you." },

            // 3xx: Redirection
            { 300, "Multiple choices. You can select a link to go to that location. Maximum five addresses." },
            { 301, "The requested resource has permanently moved to a new URL." },
            { 302, "The requested resource has temporarily moved to a different URL." },
            { 303, "The requested resource can be found under a different URL." },
            { 304, "The requested resource has not been modified since your last request." },
            { 307, "The requested resource has temporarily moved to a new URL." },
            { 308, "The requested resource has permanently moved to a new URL." },

            // 4xx: Client Error
            { 400, "The server cannot process your request due to bad syntax." },
            { 401, "You are unauthorized. Server refuses to respond without valid authentication credentials." },
            { 402, "Payment is required for accessing the resource (reserved for future use)." },
            { 403, "You are forbidden to access the requested resource." },
            { 404, "The requested resource could not be found." },
            { 405, "The server does not support the request method you used." },
            { 406, "The server can only generate a response that is not accepted by you." },
            { 407, "Proxy authentication is required for you to access the requested resource." },
            { 408, "The server timed out waiting for your request." },
            { 409, "Your request could not be completed due to a conflict." },
            { 410, "The requested resource is no longer available." },
            { 411, "The 'Content-Length' header is not defined. The server will not accept your request without it." },
            { 412, "The precondition given in your request evaluated to false by the server." },
            { 413, "The server will not accept your request because the request entity is too large." },
            { 414, "The server will not accept your request because the URI is too long." },
            { 415, "The server will not accept your request because the media type is not supported." },
            { 416, "The server cannot supply the requested portion of the file." },
            { 417, "The server cannot meet the requirements of the Expect request-header field." },

            // 5xx: Server Error
            { 500, "The server encountered an error while processing your request." },
            { 501, "The server does not recognize the request method or cannot fulfill your request." },
            { 502, "The server acting as a gateway received an invalid response from the upstream server." },
            { 503, "The server is currently unavailable (overloaded or down)." },
            { 504, "The server acting as a gateway did not receive a timely response from the upstream server." },
            { 505, "The server does not support the HTTP protocol version used in your request." },
            { 511, "Network authentication is required for you to gain network access." }
        };

            if (details.TryGetValue(statusCode, out var detail))
                return detail;

            return "A error occurred while processing your request.";
        }
    }
}