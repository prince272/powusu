using FluentValidation;

namespace POwusu.Server.Models.Blog
{
    public class PostsFilter
    {
        public int? Page { get; set; }

        public int? PageSize { get; set; }
    }

    public class PostsFilterValidator : AbstractValidator<PostsFilter>
    {
        public PostsFilterValidator()
        {
            RuleFor(_ => _.Page).GreaterThanOrEqualTo(1);
            RuleFor(_ => _.PageSize).InclusiveBetween(1, 100);
        }
    }
}
