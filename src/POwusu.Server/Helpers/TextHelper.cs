using Ganss.Xss;
using System.Globalization;
using System.Net;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;

namespace POwusu.Server.Helpers
{
    public static class TextHelper
    {
        // URL Slugify algorithm in C#?
        // source: https://stackoverflow.com/questions/2920744/url-slugify-algorithm-in-c/2921135#2921135
        public static string GenerateSlug(string input, string separator = "-")
        {
            if (input == null)
                throw new ArgumentNullException(nameof(input));

            if (separator == null)
                throw new ArgumentNullException(nameof(input));

            static string RemoveDiacritics(string text)
            {
                var normalizedString = text.Normalize(NormalizationForm.FormD);
                var stringBuilder = new StringBuilder();

                foreach (var c in normalizedString)
                {
                    var unicodeCategory = CharUnicodeInfo.GetUnicodeCategory(c);
                    if (unicodeCategory != UnicodeCategory.NonSpacingMark)
                    {
                        stringBuilder.Append(c);
                    }
                }

                return stringBuilder.ToString().Normalize(NormalizationForm.FormC);
            }

            // remove all diacritics.
            input = RemoveDiacritics(input);

            // Remove everything that's not a letter, number, hyphen, dot, whitespace or underscore.
            input = Regex.Replace(input, @"[^a-zA-Z0-9\-\.\s_]", string.Empty, RegexOptions.Compiled).Trim();

            // replace symbols with a hyphen.
            input = Regex.Replace(input, @"[\-\.\s_]", separator, RegexOptions.Compiled);

            // replace double occurrences of hyphen.
            input = Regex.Replace(input, @"(-){2,}", "$1", RegexOptions.Compiled).Trim('-');

            return input;
        }

        public static string StripHtml(string html)
        {
            if (html == null)
                throw new ArgumentNullException(nameof(html));

            var doc = new HtmlAgilityPack.HtmlDocument();
            doc.LoadHtml(html);

            if (doc.DocumentNode == null || doc.DocumentNode.ChildNodes == null)
            {
                return WebUtility.HtmlDecode(html);
            }

            var sb = new StringBuilder();
            var i = 0;

            foreach (var node in doc.DocumentNode.ChildNodes)
            {
                var text = node.InnerText?.Trim();

                if (!string.IsNullOrEmpty(text))
                {
                    sb.Append(text);

                    if (i < doc.DocumentNode.ChildNodes.Count - 1)
                    {
                        sb.Append(Environment.NewLine);
                    }
                }

                i++;
            }

            return WebUtility.HtmlDecode(sb.ToString());
        }

        public static string WrapHtml(string text)
        {
            if (text == null)
                throw new ArgumentNullException(nameof(text));

            text = HttpUtility.HtmlEncode(text);
            text = text.Replace("\r\n", "\r");
            text = text.Replace("\n", "\r");
            text = text.Replace("\r", "<br>\r\n");
            text = text.Replace("  ", " &nbsp;");
            return $"<p>{text.Trim()}</p>";
        }

        public static string SanitizeHtml(string html)
        {
            if (html == null)
                throw new ArgumentNullException(nameof(html));

            var sanitizer = new HtmlSanitizer();
            sanitizer.AllowedAttributes.Add("class");
            sanitizer.AllowDataAttributes = true;
            sanitizer.AllowedSchemes.Add("data");

            html = sanitizer.Sanitize(html).Trim();

            return html;
        }

        public static long GetTextReadingDuration(string text)
        {
            if (text == null)
                throw new ArgumentNullException(nameof(text));

            var wordCount = ((Func<int>)(() =>
            {
                int wordCount = 0, index = 0;

                // skip whitespace until first word
                while (index < text.Length && char.IsWhiteSpace(text[index]))
                    index++;

                while (index < text.Length)
                {
                    // check if current char is part of a word
                    while (index < text.Length && !char.IsWhiteSpace(text[index]))
                        index++;

                    wordCount++;

                    // skip whitespace until next word
                    while (index < text.Length && char.IsWhiteSpace(text[index]))
                        index++;
                }

                return wordCount;
            }))();

            // Slow = 100 wpm, Average = 130 wpm, Fast = 160 wpm. 
            var wordsPerMinute = 70;
            var wordsTotalSeconds = wordCount / (wordsPerMinute / 60);
            var wordsTotalTicks = (long)Math.Round(wordsTotalSeconds * Math.Pow(10, 9) / 100);
            return wordsTotalTicks;
        }
    }
}
