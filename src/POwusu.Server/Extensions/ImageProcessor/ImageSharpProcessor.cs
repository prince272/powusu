using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Advanced;
using SixLabors.ImageSharp.Formats;
using SixLabors.ImageSharp.Processing;

namespace POwusu.Server.Extensions.ImageProcessor
{
    public class ImageSharpProcessor : IImageProcessor
    {
        /// <summary>
        /// Gets an image from the provided source and returns its size.
        /// </summary>
        /// <param name="source">The image data stream</param>
        /// <returns>A tuple with the width and height</returns>
        public async Task<(int Width, int Height)> GetSizeAsync(Stream source, CancellationToken cancellationToken = default)
        {
            var position = source.Position;
            var imageInfo = await Image.IdentifyAsync(source, cancellationToken);
            source.Position = position;
            return (imageInfo.Width, imageInfo.Height);
        }

        /// <summary>
        /// Gets an image from the provided source and returns its size.
        /// </summary>
        /// <param name="source">The image data stream</param>
        /// <returns>A tuple with the width and height</returns>
        public Task<(int Width, int Height)> GetSizeAsync(byte[] source, CancellationToken cancellationToken = default)
        {
            var imageInfo = Image.Identify(source);
            return Task.FromResult((imageInfo.Width, imageInfo.Height));
        }

        /// <summary>
        /// Gets an image from the provided stream, crops it according
        /// to the given size, and writes out a new jpeg image on the
        /// destination stream asynchronously.
        /// </summary>
        /// <param name="source">The image data stream</param>
        /// <param name="destination">The destination stream</param>
        /// <param name="width">The requested width</param>
        /// <param name="height">The requested height</param>
        /// <returns>A Task representing the asynchronous operation</returns>
        public async Task CropAsync(Stream source, int width, int height, Stream? destination = null, CancellationToken cancellationToken = default)
        {
            var initialSourcePosition = source.Position;
            var initialDestinationPosition = destination?.Position ?? 0;

            using var image = await Image.LoadAsync(source, cancellationToken);
            image.Mutate(x => x.Crop(new Rectangle
            {
                Width = width,
                Height = height,
                X = width < image.Width ? (image.Width - width) / 2 : 0,
                Y = height < image.Height ? (image.Height - height) / 2 : 0
            }));

            if (destination is not null)
            {
                await image.SaveAsync(destination, image.Metadata.DecodedImageFormat!);
                destination.Position = initialDestinationPosition;
            }
            else
            {
                source.Position = initialSourcePosition;
                source.SetLength(0);

                await image.SaveAsync(source, image.Metadata.DecodedImageFormat!);

                source.Position = initialSourcePosition;
            }
        }

        /// <summary>
        /// Gets an image from the provided stream, scales it according
        /// to the given width, and writes out a new jpeg image on the
        /// destination stream asynchronously.
        /// </summary>
        /// <param name="source">The image data stream</param>
        /// <param name="destination">The destination stream</param>
        /// <param name="width">The requested width</param>
        /// <returns>A task representing the asynchronous operation.</returns>
        public async Task ScaleAsync(Stream source, int width, Stream? destination = null, CancellationToken cancellationToken = default)
        {
            var initialSourcePosition = source.Position;
            var initialDestinationPosition = destination?.Position ?? 0;

            using var image = await Image.LoadAsync(source, cancellationToken);
            int height = (int)Math.Round(width * ((float)image.Height / image.Width));

            image.Mutate(x => x.Resize(new ResizeOptions
            {
                Size = new Size(width, height),
                Mode = ResizeMode.Crop
            }));

            if (destination is not null)
            {
                await image.SaveAsync(destination, image.Metadata.DecodedImageFormat!);
                destination.Position = initialDestinationPosition;
            }
            else
            {
                source.Position = initialSourcePosition;
                source.SetLength(0);

                await image.SaveAsync(source, image.Metadata.DecodedImageFormat!);

                source.Position = initialSourcePosition;
            }
        }

        /// <summary>
        /// Gets an image from the provided stream, crops and scales it
        /// according to the given size, and writes out a new jpeg image
        /// on the destination stream asynchronously.
        /// </summary>
        /// <param name="source">The image data stream</param>
        /// <param name="destination">The destination stream</param>
        /// <param name="width">The requested width</param>
        /// <param name="height">The requested height</param>
        /// <returns>A task representing the asynchronous operation.</returns>
        public async Task CropScaleAsync(Stream source, int width, int height, Stream? destination = null, CancellationToken cancellationToken = default)
        {
            var initialSourcePosition = source.Position;
            var initialDestinationPosition = destination?.Position ?? 0;

            using var image = await Image.LoadAsync(source, cancellationToken);
            var oldRatio = (float)image.Height / image.Width;
            var newRatio = (float)height / width;
            var cropWidth = image.Width;
            var cropHeight = image.Height;

            if (newRatio < oldRatio)
            {
                cropHeight = (int)Math.Round(image.Width * newRatio);
            }
            else
            {
                cropWidth = (int)Math.Round(image.Height / newRatio);
            }

            image.Mutate(x => x.Crop(new Rectangle
            {
                Width = cropWidth,
                Height = cropHeight,
                X = cropWidth < image.Width ? (image.Width - cropWidth) / 2 : 0,
                Y = cropHeight < image.Height ? (image.Height - cropHeight) / 2 : 0
            }));
            image.Mutate(x => x.Resize(new ResizeOptions
            {
                Size = new Size(width, height),
                Mode = ResizeMode.Crop
            }));

            if (destination is not null)
            {
                await image.SaveAsync(destination, image.Metadata.DecodedImageFormat!, cancellationToken);
                destination.Position = initialDestinationPosition;
            }
            else
            {
                source.Position = initialSourcePosition;
                source.SetLength(0);

                await image.SaveAsync(source, image.Metadata.DecodedImageFormat!, cancellationToken);

                source.Position = initialSourcePosition;
            }
        }

        /// <summary>
        /// Auto orients the image according to exif information.
        /// </summary>
        /// <param name="source">The image data stream</param>
        /// <param name="destination">The destination stream</param>
        /// <returns>A Task representing the asynchronous operation</returns>
        public async Task AutoOrientAsync(Stream source, Stream? destination = null, CancellationToken cancellationToken = default)
        {
            var initialSourcePosition = source.Position;
            var initialDestinationPosition = destination?.Position ?? 0;

            using var image = await Image.LoadAsync(source, cancellationToken);
            image.Mutate(x => x.AutoOrient());

            if (destination is not null)
            {
                await image.SaveAsync(destination, image.Metadata.DecodedImageFormat!, cancellationToken);
                destination.Position = initialDestinationPosition;
            }
            else
            {
                source.Position = initialSourcePosition;
                source.SetLength(0);

                await image.SaveAsync(source, image.Metadata.DecodedImageFormat!, cancellationToken);

                source.Position = initialSourcePosition;
            }
        }
    }
}
