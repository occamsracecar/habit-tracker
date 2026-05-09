export function getDaysInCurrentMonth(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

export function isFutureDayIndex(dayIndex: number, date = new Date()) {
  const currentMonth = date.getMonth();
  const currentYear = date.getFullYear();
  const targetDate = new Date(currentYear, currentMonth, dayIndex);

  return targetDate > date;
}

export function formatCurrentMonthName(date = new Date()) {
  return date.toLocaleString("default", { month: "long" });
}
