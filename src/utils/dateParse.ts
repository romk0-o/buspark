export default function dateParse(dateString: string): Date {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  const dateArr = dateString.split("/");
  date.setFullYear(
    parseInt(dateArr[2]),
    parseInt(dateArr[1]) - 1,
    parseInt(dateArr[0])
  );
  return date;
}
