export function formatDate(date: Date, seperator: string = "."): string {
  return `${
    date.getMonth() + 1
  }${seperator}${date.getDate()}${seperator}${date.getFullYear()}`;
}
