using FluentValidation;
using POwusu.Server.Helpers;
using System.ComponentModel;

namespace POwusu.Server.Models.Blog
{
    public class PostsFilter
    {
        [DefaultValue(1)]
        public int? Page { get; set; } 

        [DefaultValue(25)]
        public int? PageSize { get; set; }

        [DefaultValue(false)]
        public bool? Deleted { get; set; }


        public void SetDefaultValues()
        {
            // Use the DefaultValue propety of each property to actually set it, via reflection.
            foreach (PropertyDescriptor prop in TypeDescriptor.GetProperties(this))
            {
                if (prop.Attributes[typeof(DefaultValueAttribute)] is DefaultValueAttribute attr)
                {
                    if (prop.GetValue(this) is null) prop.SetValue(this, attr.Value);
                }
            }
        }
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
