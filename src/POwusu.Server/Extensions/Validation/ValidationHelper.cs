using FluentValidation;
using PhoneNumbers;
using System.Net.Mail;
using System.Text.RegularExpressions;

namespace POwusu.Server.Extensions.Validation
{
    public static class ValidationHelper
    {
        public static MailAddress ParseEmail(string value)
        {
            if (value is null) throw new ArgumentNullException(nameof(value));

            Exception? innerException = null;

            try
            {
                var emailAddress = new MailAddress(value);

                if (emailAddress.Address == value)
                {
                    return emailAddress;
                }
            }
            catch (Exception exception) { innerException = exception; }

            throw new FormatException($"Input '{value}' was not recognized as a valid email address.", innerException);
        }

        public static PhoneNumber ParsePhoneNumber(string value)
        {
            if (value is null) throw new ArgumentNullException(nameof(value));

            Exception? innerException = null;

            try
            {
                var phoneNumberHelper = PhoneNumberUtil.GetInstance();
                var phoneNumber = phoneNumberHelper.ParseAndKeepRawInput(value, null);

                if (phoneNumberHelper.IsValidNumber(phoneNumber) && phoneNumber.RawInput == value)
                {
                    return phoneNumber;
                }

            }
            catch (Exception exception) { innerException = exception; }

            throw new FormatException($"Input '{value}' was not recognized as a valid phone number.", innerException);
        }

        public static ContactType GetContactType(string value)
        {
            if (value is null) throw new ArgumentNullException(nameof(value));

            return !Regex.IsMatch(value.ToLower(), "^[-+0-9() ]+$") ? ContactType.Email : ContactType.PhoneNumber;
        }
    }

    public enum ContactType
    {
        Email,
        PhoneNumber
    }
}
