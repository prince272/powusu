using Microsoft.Extensions.Options;
using System.Diagnostics;
using WebPush;

namespace POwusu.Server.Extensions.WebPusher
{
    public class WebPusherOptions
    {
        public string VapidSubject { get; set; } = null!;

        public string VapidPublicKey { get; set; } = null!;

        public string VapidPrivateKey { get; set; } = null!;
    }
}
