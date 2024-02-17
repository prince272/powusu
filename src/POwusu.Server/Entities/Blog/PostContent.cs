namespace POwusu.Server.Entities.Blog
{
    public class PostContent
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();

        public string? Value { get; set; } = null!;

        public string Type { get; set; } = null!;
    }
}
