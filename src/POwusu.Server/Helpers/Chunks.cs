using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;

namespace POwusu.Server.Helpers
{
    // Using LINQ and Getting Chunky With .NET
    // source: https://khalidabuhakmeh.com/getting-chunky-with-dotnet
    public record Chunks : IEnumerable<Chunks.Chunk>
    {
        public Chunks(long totalCount, int chunkSize)
        {
            Items = CreateRange(0, totalCount)
                .Chunk(chunkSize)
                .Select((value, index) => new Chunk(index, value.Length))
                .ToList();
        }

        private IEnumerable<long> CreateRange(long start, long count)
        {
            var limit = start + count;

            while (start < limit)
            {
                yield return start;
                start++;
            }
        }

        private List<Chunk> Items { get; }
        public int MaxSize => Items.Max(x => x.Count);
        public int MinSize => Items.Min(x => x.Count);
        public int TotalChunks => Items.Count;

        public IEnumerator<Chunk> GetEnumerator()
            => Items.GetEnumerator();
        IEnumerator IEnumerable.GetEnumerator()
            => GetEnumerator();

        public record Chunk(int Index, int Count);
    }
}
