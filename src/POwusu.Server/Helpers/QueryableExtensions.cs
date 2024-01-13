namespace POwusu.Server.Helpers
{
    public static class QueryableExtensions
    {
        public static IQueryable<T> LongSkip<T>(this IQueryable<T> items, long count)
            => LongSkip(items, int.MaxValue, count);

        internal static IQueryable<T> LongSkip<T>(this IQueryable<T> items, int segmentSize, long count)
        {
            long segmentCount = Math.DivRem(count, segmentSize, out long remainder);

            for (long i = 0; i < segmentCount; i += 1)
                items = items.Skip(segmentSize);

            if (remainder != 0)
                items = items.Skip((int)remainder);

            return items;
        }
    }
}
