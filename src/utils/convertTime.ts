export default function convertTime(isoDateString: string): string {
  const date = new Date(isoDateString);

  const brazilOffset = -3 * 60;
  const localOffset = date.getTimezoneOffset(); 
  const totalOffset = (localOffset - brazilOffset) * 60 * 1000;

  const brazilDate = new Date(date.getTime() + totalOffset);

  const day = brazilDate.getDate().toString().padStart(2, '0');
  const month = (brazilDate.getMonth() + 1).toString().padStart(2, '0');
  const year = brazilDate.getFullYear();
  const hours = brazilDate.getHours().toString().padStart(2, '0');
  const minutes = brazilDate.getMinutes().toString().padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}
