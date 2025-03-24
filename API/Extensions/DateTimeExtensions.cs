namespace API.Extensions
{
    public static class DateTimeExtensions
    {
        public static int CalculateAge(this DateOnly dateOfBirth)
        {
            // Disclaimer: does not account for leap years
            var today = DateOnly.FromDateTime(DateTime.Now);

            var age = today.Year - dateOfBirth.Year;

            if (dateOfBirth > today.AddYears(-age)) age--;

            return age;
        }
    }
}
