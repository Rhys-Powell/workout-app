namespace WorkoutApp.Api.Helpers;

public static class StringHelper
{
    public static string ExtractSubstring(string str, string marker)
    {
        int index = str.IndexOf(marker);
        if (index != -1)
        {
            return str.Substring(index + 1);
        }
        return str;
    }
}