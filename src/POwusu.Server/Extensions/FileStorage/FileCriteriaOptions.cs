using Microsoft.AspNetCore.Mvc.Formatters;
using System.IO;

namespace POwusu.Server.Extensions.FileStorage
{
    public class FileCriteriaOptions
    {
        public IList<FileCriteria> Documents { get; set; } = new List<FileCriteria>();

        public IList<FileCriteria> Images { get; set; } = new List<FileCriteria>();

        public IList<FileCriteria> Videos { get; set; } = new List<FileCriteria>();

        public IList<FileCriteria> Audios { get; set; } = new List<FileCriteria>();

        public IList<FileCriteria> All => new[] { Documents, Images, Videos, Audios }.SelectMany(_ => _).ToList();

        public FileCriteria? Get(IEnumerable<FileCriteria> fileCriterias, string extension)
        {
            return fileCriterias.FirstOrDefault(_ => string.Equals(_.Extension, extension, StringComparison.OrdinalIgnoreCase));
        }

        public bool Has(IEnumerable<FileCriteria> fileCriterias, string extension)
        {
            return fileCriterias.Any(_ => string.Equals(_.Extension, extension, StringComparison.OrdinalIgnoreCase));
        }
    }


    public class FileCriteria
    {
        public string Extension { get; set; } = null!;

        public long Length { get; set; }

        public FileType Type { get; set; }
    }

    public enum FileType
    {
        Unknown,
        Document,
        Image,
        Video,
        Audio
    }
}
