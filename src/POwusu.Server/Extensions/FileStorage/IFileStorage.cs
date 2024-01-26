namespace POwusu.Server.Extensions.FileStorage
{
    public interface IFileStorage
    {
        Task<FileStorageStatus> CheckAsync(string path, CancellationToken cancellationToken = default);

        Task WriteAsync(string path, Stream content, CancellationToken cancellationToken = default);

        Task WriteAsync(string path, Stream chunk, long length, long offset, CancellationToken cancellationToken = default);

        Task<Stream?> ReadAsync(string path, CancellationToken cancellationToken = default);

        Task DeleteAsync(string path, CancellationToken cancellationToken = default);

        Task<bool> ExistsAsync(string path, CancellationToken cancellationToken = default);

        string GetUrl(string path);
    }

    public enum FileStorageStatus
    {
        Pending,
        Processing,
        Completed
    }
}
