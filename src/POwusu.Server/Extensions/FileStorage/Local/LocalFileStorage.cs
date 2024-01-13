using Microsoft.Extensions.Options;
using System.IO;
using Flurl;
using POwusu.Server.Extensions.FileStorage;

namespace POwusu.Server.Extensions.FileStorage.Local
{
    public class LocalFileStorage : IFileStorage
    {
        private readonly IOptions<LocalFileStorageOptions> _localFileStorageOptions;

        public LocalFileStorage(IOptions<LocalFileStorageOptions> localFileStorageOptions)
        {
            _localFileStorageOptions = localFileStorageOptions;
        }

        public async Task WriteAsync(string path, Stream content, CancellationToken cancellationToken = default)
        {
            if (path == null) throw new ArgumentNullException(nameof(path));
            if (content == null) throw new ArgumentNullException(nameof(content));

            var filePath = GetFilePath(path);
            using var fileStream = File.Create(filePath);
            await content.CopyToAsync(fileStream, cancellationToken);
        }

        public Task<FileStorageStatus> CheckAsync(string path, CancellationToken cancellationToken = default)
        {
            var filePath = GetFilePath(path);
            var tempFilePath = GetTempFilePath(path);
            var status = !File.Exists(tempFilePath) ? FileStorageStatus.Pending : !File.Exists(filePath) ? FileStorageStatus.Processing : FileStorageStatus.Completed;
            return Task.FromResult(status);
        }

        public async Task WriteAsync(string path, Stream chunk, long length, long offset, CancellationToken cancellationToken = default)
        {
            if (path == null) throw new ArgumentNullException(nameof(path));
            if (chunk == null) throw new ArgumentNullException(nameof(chunk));


            var filePath = GetFilePath(path);
            var tempFilePath = GetTempFilePath(path);


            using var tempFileStream = new FileStream(tempFilePath, FileMode.OpenOrCreate, FileAccess.Write);
            tempFileStream.Seek(offset, SeekOrigin.Begin);
            await chunk.CopyToAsync(tempFileStream, cancellationToken);

            var fileLength = new FileInfo(tempFilePath).Length;

            if (fileLength >= length)
            {
                if (File.Exists(filePath))
                {
                    File.Delete(filePath);
                }

                File.Move(tempFilePath, filePath);
            }
        }

        public Task<Stream?> ReadAsync(string path, CancellationToken cancellationToken = default)
        {
            if (path == null) throw new ArgumentNullException(nameof(path));

            var filePath = GetFilePath(path);

            if (File.Exists(filePath))
            {
                return Task.FromResult((Stream?)new FileStream(filePath, FileMode.Open, FileAccess.Read));
            }

            return Task.FromResult<Stream?>(null);
        }

        public Task DeleteAsync(string path, CancellationToken cancellationToken = default)
        {
            if (path == null) throw new ArgumentNullException(nameof(path));

            var filePath = GetFilePath(path);

            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }

            return Task.CompletedTask;
        }

        public Task<bool> ExistsAsync(string path, CancellationToken cancellationToken = default)
        {
            if (path == null) throw new ArgumentNullException(nameof(path));

            var filePath = GetFilePath(path);
            return Task.FromResult(File.Exists(filePath));
        }

        public ValueTask<string> GetUrlAsync(string path)
        {
            if (path == null) throw new ArgumentNullException(nameof(path));
            var url = _localFileStorageOptions.Value.RootUrl.AppendPathSegment(path);
            return ValueTask.FromResult(url.ToString());
        }


        private string GetFilePath(string path)
        {
            if (path == null) throw new ArgumentNullException(nameof(path));


            var invalidFileNameChars = Path.GetFileName(path)?.Where(c => Path.GetInvalidPathChars().Concat(new[] { '/', '\\' }).Contains(c)).ToArray() ?? Array.Empty<char>();
            if (invalidFileNameChars.Length > 0) throw new ArgumentException($"Invalid characters in file name: {string.Join(string.Empty, invalidFileNameChars)}");

            var directoryNames = Path.GetDirectoryName(path)?.Split(new char[] { '/', '\\' }) ?? Array.Empty<string>();

            foreach (var directoryName in directoryNames)
            {
                var invalidDirectoryNameChars = directoryName.Where(c => Path.GetInvalidPathChars().Concat(new[] { '/', '\\' }).Contains(c)).ToArray();
                if (invalidDirectoryNameChars.Length > 0) throw new ArgumentException($"Invalid characters in directory name: {string.Join(", ", invalidDirectoryNameChars)}");
            }

            var filePath = Path.Combine(_localFileStorageOptions.Value.RootPath, path.Replace('/', '\\').TrimStart('\\', '/'));
            var dirPath = Path.GetDirectoryName(filePath)!;

            if (!Directory.Exists(dirPath)) Directory.CreateDirectory(dirPath);

            return filePath;
        }

        private string GetTempFilePath(string path)
        {
            return $"{GetTempFilePath(path)}.temp";
        }
    }
}
