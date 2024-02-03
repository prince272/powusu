using FluentValidation;
using Humanizer;
using POwusu.Server.Helpers;
using System.Reflection;

namespace POwusu.Server.Extensions.Validation
{

    public static class ServiceCollection
    {
        public static IServiceCollection AddValidators(this IServiceCollection services, params Assembly[] assemblies)
        {
            services.AddScoped<IValidator, Validator>();

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

            var validatorTypes = assemblies.SelectMany(_ => _.DefinedTypes).Select(_ => _.AsType()).Where(type => type.IsClass && !type.IsAbstract && !type.IsGenericType && type.IsCompatibleWith(typeof(IValidator<>))).ToArray();

            foreach (var concreteType in validatorTypes)
            {
                var matchingInterfaceType = concreteType.GetInterfaces().FirstOrDefault(i => i.IsGenericType && i.GetGenericTypeDefinition() == typeof(IValidator<>));

                if (matchingInterfaceType != null)
                {
                    services.AddScoped(matchingInterfaceType, concreteType);
                }
            }

            return services;
        }

    }

    public static class ValidationExtensions
    {
        public static IRuleBuilderOptionsConditions<T, string> Username<T>(this IRuleBuilder<T, string> ruleBuilder, ContactType? contactType = null)
        {
            return ruleBuilder.Custom((value, context) =>
            {
                contactType ??= ValidationHelper.GetContactType(value);

                if (contactType == ContactType.Email)
                {
                    try { ValidationHelper.ParseEmail(value); }
                    catch (FormatException) { context.AddFailure("'Email' is not valid."); }
                }
                else if (contactType == ContactType.PhoneNumber)
                {
                    try { ValidationHelper.ParsePhoneNumber(value); }
                    catch (FormatException) { context.AddFailure("'Phone number' is not valid."); }
                }
                else
                {
                    throw new InvalidOperationException($"Username '{value}' was not recognized as a valid email or phone number.");
                }
            });
        }

        public static IRuleBuilderOptionsConditions<T, string> Email<T>(this IRuleBuilder<T, string> ruleBuilder)
        {
            return ruleBuilder.Custom((value, context) =>
            {
                try { ValidationHelper.ParseEmail(value); }
                catch (FormatException) { context.AddFailure("'{PropertyName}' is not valid."); }
            });
        }

        public static IRuleBuilderOptionsConditions<T, string> PhoneNumber<T>(this IRuleBuilder<T, string> ruleBuilder)
        {
            return ruleBuilder.Custom((value, context) =>
            {
                try { ValidationHelper.ParsePhoneNumber(value); }
                catch (FormatException) { context.AddFailure("'{PropertyName}' is not valid."); }
            });
        }

        // How can I create strong passwords with FluentValidation?
        // source: https://stackoverflow.com/questions/63864594/how-can-i-create-strong-passwords-with-fluentvalidation
        public static IRuleBuilderOptions<T, string> Password<T>(this IRuleBuilderOptions<T, string> ruleBuilder, int minimumLength = 6)
        {
            var options = ruleBuilder
                .MinimumLength(minimumLength)
                .Matches("[A-Z]").WithMessage("'{PropertyName}' must contain at least 1 upper case.")
                .Matches("[a-z]").WithMessage("'{PropertyName}' must contain at least 1 lower case.")
                .Matches("[0-9]").WithMessage("'{PropertyName}' must contain at least 1 digit.")
                .Matches("[^a-zA-Z0-9]").WithMessage("'{PropertyName}' must contain at least 1 special character.");

            return options;
        }
    }
}