export function timeLabel(value) {
  if (!value) return '';
  return new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }).format(new Date(value));
}

export function lastSeenLabel(value) {
  if (!value) return 'Last seen recently';
  return `Last seen ${new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))}`;
}
