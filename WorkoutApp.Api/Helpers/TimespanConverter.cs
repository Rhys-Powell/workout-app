namespace WorkoutApp.Api.Helpers;

public class TimeSpanConverter
{
  public static TimeSpan ConvertToTimeSpan(string durationString)
  {
    var match = System.Text.RegularExpressions.Regex.Match(durationString, @"^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$");

    if (match.Success)
    {
      int hours = match.Groups[1].Success ? int.Parse(match.Groups[1].Value) : 0;
      int minutes = match.Groups[2].Success ? int.Parse(match.Groups[2].Value) : 0;
      int seconds = match.Groups[3].Success ? int.Parse(match.Groups[3].Value) : 0;

      return new TimeSpan(hours, minutes, seconds);
    }

    throw new FormatException("Invalid duration string");
  }
}