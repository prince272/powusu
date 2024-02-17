using FluentValidation;
using System.ComponentModel;

namespace POwusu.Server.Models.Blog
{
    public class PostsFilter
    {
        [DefaultValue(1)]
        public int Page { get; set; } = 1;

        [DefaultValue(25)]
        public int PageSize { get; set; } = 25;
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
