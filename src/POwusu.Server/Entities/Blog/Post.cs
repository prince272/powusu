﻿using POwusu.Server.Entities.Identity;

namespace POwusu.Server.Entities.Blog
{
    public class Post
    {
        public virtual User Author { get; set; } = null!;

        public string AuthorId { get; set; } = null!;

        public string Id { get; set; } = Guid.NewGuid().ToString();

        public string Title { get; set; } = null!;

        public string? Summary { get; set; } = null!;

        public virtual PostContent Content { get; set; } = null!;

        public string ContentId { get; set; } = null!;

        public string? ImageId { get; set; } 

        public string Slug { get; set; } = null!;

        public DateTimeOffset CreatedAt { get; set; }

        public DateTimeOffset? UpdatedAt { get; set; }

        public DateTimeOffset? PublishedAt { get; set; }

        public bool Published { get; set; }

        public DateTimeOffset? DeletedAt { get; set; }

        public bool Deleted { get; set; }

        public long ReadingDuration { get; set; }
    }
}
