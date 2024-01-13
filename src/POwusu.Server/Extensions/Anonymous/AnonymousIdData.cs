using System;

namespace POwusu.Server.Extensions.Anonymous
{
    public class AnonymousIdData
    {
        public string? AnonymousId { get; set; }

        public DateTime ExpireDate { get; set; }

        public AnonymousIdData(string id, DateTime timeStamp)
        {
            AnonymousId = timeStamp > DateTime.UtcNow ? id : null;
            ExpireDate = timeStamp;
        }
    }
}