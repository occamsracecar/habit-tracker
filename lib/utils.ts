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

export function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getCurrentMonthDateRange(date = new Date()) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  return {
    startDate: formatDateKey(start),
    endDate: formatDateKey(end),
  };
}

export function getDateForDayIndex(dayIndex: number, date = new Date()) {
  return formatDateKey(
    new Date(date.getFullYear(), date.getMonth(), dayIndex),
  );
}

export function getRandomCoinValue() {
  return Math.floor(Math.random() * 11);
}
