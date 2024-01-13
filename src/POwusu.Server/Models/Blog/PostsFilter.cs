using FluentValidation;

namespace POwusu.Server.Models.Blog
{
    public class PostsFilter
    {
        public long Offset { get; set; } = 0;

        public int Limit { get; set; } = 25;
    }

    public class PostsFilterValidator : AbstractValidator<PostsFilter>
    {
        public PostsFilterValidator()
        {
            RuleFor(_ => _.Offset).GreaterThanOrEqualTo(0);
            RuleFor(_ => _.Limit).InclusiveBetween(1, 100);
        }
    }
}
