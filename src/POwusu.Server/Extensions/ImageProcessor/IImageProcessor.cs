namespace POwusu.Server.Extensions.ImageProcessor
{
    public interface IImageProcessor
    {
        Task<(int Width, int Height)> GetSizeAsync(Stream source, CancellationToken cancellationToken = default);

        Task CropAsync(Stream source, int width, int height, Stream? destination = null, CancellationToken cancellationToken = default);

        Task ScaleAsync(Stream source, int width, Stream? destination = null, CancellationToken cancellationToken = default);

        Task CropScaleAsync(Stream source, int width, int height, Stream? destination = null, CancellationToken cancellationToken = default);

        Task AutoOrientAsync(Stream source, Stream? destination = null, CancellationToken cancellationToken = default);
    }
}
