using FluentValidation;

namespace POwusu.Server.Extensions.Validation
{
    public class Validator : IValidator
    {
        private readonly IServiceProvider _serviceProvider;

        public Validator(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }


        public async Task<ValidationResult> ValidateAsync<TModel>(TModel model)
        {
            if (model == null) throw new ArgumentNullException(nameof(model));

            var modelValidator = _serviceProvider.GetRequiredService<IValidator<TModel>>();
            var modelValidationResult = await modelValidator.ValidateAsync(model);
            var errors = modelValidationResult.ToDictionary().ToDictionary();
            var isValid = modelValidationResult.IsValid;

            return new ValidationResult { IsValid = isValid, Errors = errors };
        }
    }

    public interface IValidator
    {
        Task<ValidationResult> ValidateAsync<TModel>(TModel model);
    }

    public class ValidationResult
    {
        public bool IsValid { get; set; }

        public Dictionary<string, string[]> Errors { get; set; } = null!;
    }
}
