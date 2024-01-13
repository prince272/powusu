using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using POwusu.Server.Entities.Blog;

namespace POwusu.Server.Data.Configurations.Blog
{
    public class PostContentConfiguration : IEntityTypeConfiguration<PostContent>
    {
        public void Configure(EntityTypeBuilder<PostContent> builder)
        {
            builder.ToTable(nameof(PostContent));
        }
    }
}
