using Microsoft.Extensions.Options;
using System.IO;
using Flurl;

namespace POwusu.Server.Extensions.FileStorage
{
    public class LocalFileStorage : IFileStorage
    {
        private readonly IOptions<LocalFileStorageOptions> _localFileStorageOptions;
        private readonly ILogger<LocalFileStorage> _logger;

        public LocalFileStorage(IOptions<LocalFileStorageOptions> localFileStorageOptions, ILogger<LocalFileStorage> logger)
        {
            _localFileStorageOptions = localFileStorageOptions;
            _logger = logger;
        }

        public async Task WriteAsync(string path, Stream content, CancellationToken cancellationToken = default)
        {
            if (path == null) throw new ArgumentNullException(nameof(path));
            if (content == null) throw new ArgumentNullException(nameof(content));

            var filePath = GetFilePath(path);
            using var fileStream = new FileStream(filePath, FileMode.CreateNew, FileAccess.Write);
            await content.CopyToAsync(fileStream, cancellationToken);
        }

        public async Task<FileWriteStatus> WriteAsync(string path, Stream chunk, long length, long offset, CancellationToken cancellationToken = default)
        {
            if (path == null) throw new ArgumentNullException(nameof(path));
            if (chunk == null) throw new ArgumentNullException(nameof(chunk));

            var filePath = GetFilePath(path);
            var tempFilePath = GetTempFilePath(path);
            var initialWrite = !File.Exists(filePath) && !File.Exists(tempFilePath);

            try
            {
                using (var tempFileStream = new FileStream(tempFilePath, FileMode.OpenOrCreate, FileAccess.Write))
                {
                    tempFileStream.Seek(offset, SeekOrigin.Begin);
                    await chunk.CopyToAsync(tempFileStream, cancellationToken);
                }

                var tempFileLength = new FileInfo(tempFilePath).Length;

                if (tempFileLength >= length)
                {
                    File.Move(tempFilePath, filePath);
                    return FileWriteStatus.Completed;
                }
                else
                {
                    return initialWrite ? FileWriteStatus.Started : FileWriteStatus.Processing;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"An error occurred while writing to file '{path}'");
                throw;
            }
        }


        public Task<Stream?> ReadAsync(string path, CancellationToken cancellationToken = default)
        {
            if (path == null) throw new ArgumentNullException(nameof(path));

            var filePath = GetFilePath(path);

            if (File.Exists(filePath))
            {
                return Task.FromResult((Stream?)new FileStream(filePath, FileMode.Open, FileAccess.ReadWrite));
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

        public string GetUrl(string path)
        {
            if (path == null) throw new ArgumentNullException(nameof(path));
            var url = _localFileStorageOptions.Value.RootUrl.AppendPathSegment(path);
            return url.ToString();
        }


        private string GetFilePath(string path)
        {
            if (path == null)
                throw new ArgumentNullException(nameof(path));

            var invalidFileNameChars = Path.GetFileName(path)?.Where(c => Path.GetInvalidFileNameChars().Contains(c)).ToArray() ?? Array.Empty<char>();
            if (invalidFileNameChars.Length > 0)
                throw new ArgumentException($"Invalid characters in file name: {string.Join(string.Empty, invalidFileNameChars)}");

            var directoryNames = Path.GetDirectoryName(path)?.Split(Path.DirectorySeparatorChar, Path.AltDirectorySeparatorChar) ?? Array.Empty<string>();

            foreach (var directoryName in directoryNames)
            {
                var invalidDirectoryNameChars = directoryName.Where(c => Path.GetInvalidPathChars().Contains(c)).ToArray();
                if (invalidDirectoryNameChars.Length > 0)
                    throw new ArgumentException($"Invalid characters in directory name: {string.Join(", ", invalidDirectoryNameChars)}");
            }

            var filePath = Path.Combine(_localFileStorageOptions.Value.RootPath, path.Replace('/', Path.DirectorySeparatorChar).TrimStart('\\', '/'));
            var dirPath = Path.GetDirectoryName(filePath)!;

            if (!Directory.Exists(dirPath))
                Directory.CreateDirectory(dirPath);

            return filePath;
        }

        private string GetTempFilePath(string path)
        {
            return $"{GetFilePath(path)}.temp";
        }
    }
}
