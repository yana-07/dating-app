using AutoMapper;
using System.Globalization;

namespace API.Helpers
{
    public class StringToDateOnlyConverter : ITypeConverter<string, DateOnly>
    {
        public DateOnly Convert(string source, DateOnly destination, ResolutionContext context)
        {
            bool isParsed = DateOnly.TryParseExact(source, "yyyy-MM-dd",
                CultureInfo.InvariantCulture, DateTimeStyles.None, out DateOnly date);

            if (isParsed) return date;
            
            return default;
        }
    }
}
