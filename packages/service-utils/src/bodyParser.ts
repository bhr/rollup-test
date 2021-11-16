const regexIso8601 = /^(\d{4}|\+\d{6})(?:-(\d{2})(?:-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2})\.(\d{1,})(Z|([-+])(\d{2}):(\d{2}))?)?)?)?$/;

export function reviveDates(key: string, value: any) {
  if (typeof value === 'string') {
    const match = value.match(regexIso8601);
    if (match && match.length > 0) {
      const milliseconds = Date.parse(match[0]);
      if (!Number.isNaN(milliseconds)) {
        return new Date(milliseconds);
      }
    }
  }
  return value;
}
