import dayjs from "dayjs";

export const FORMATE_DATE = "YYYY-MM-DD";

export const dateRangeValidate = (dateRange: string[]) => {
  if (!dateRange || dateRange.length <= 0) return undefined;

  const startDate = dayjs(dateRange[0], FORMATE_DATE).toDate();
  const endDate = dayjs(dateRange[1], FORMATE_DATE).toDate();

  return [startDate, endDate];
};
