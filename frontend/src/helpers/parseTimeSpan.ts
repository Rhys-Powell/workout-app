export function parseTimeSpan(timeSpanString: string) {
    const match = timeSpanString.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
    if (match === null) {
      return null;
    }
    return {
      hours: match[1] ? parseInt(match[1]) : 0,
      minutes: match[2] ? parseInt(match[2]) : 0,
      seconds: match[3] ? parseInt(match[3]) : 0,
    };
  }