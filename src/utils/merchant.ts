export function calculator(fullData: any) {
  const {
    fixedPrice,
    hourlyRate,
    dailyRate,
    monthlyRate,
    startDateTime,
    endDateTime,
    entryTime,
  } = fullData;

  if (fixedPrice) {
    if (
      !dailyRate &&
      !startDateTime &&
      !endDateTime &&
      !monthlyRate &&
      !hourlyRate
    ) {
      return fixedPrice;
    }
  }
  if (hourlyRate) {
    if (
      !fixedPrice &&
      !dailyRate &&
      !startDateTime &&
      !endDateTime &&
      !monthlyRate
    ) {
      const diffHours = getHourDifference(entryTime, Date.now());
      return diffHours * hourlyRate;
    }
  }

  const currentTime = getFormatTime(Date.now()); // xxxx

  const diffDays = getDayDifference(entryTime, Date.now());

  if (diffDays >= 30) {
    return (
      Math.floor(diffDays / 30) * Number(monthlyRate) +
      (diffDays % 30) * Number(dailyRate)
    );
  } else if (diffDays > 0) {
    return diffDays * dailyRate;
  }

  if (currentTime > endDateTime) {
    return dailyRate;
  }

  if (currentTime >= startDateTime && currentTime <= endDateTime) {
    return fixedPrice;
  }
}

function getHourDifference(timestamp1: number, timestamp2: number) {
  const millisecondsPerHour = 60 * 60 * 1000; // Number of milliseconds in an hour
  const timeDifference = Math.abs(timestamp1 - timestamp2);
  const hourDifference = Math.floor(timeDifference / millisecondsPerHour);
  return hourDifference;
}

function getFormatTime(timeStamp: number) {
  const date = new Date();
  const h = date.getHours();
  const m = date.getMinutes();
  // Log to console

  return h * 100 + m;
}

function getDayDifference(timestamp1: number, timestamp2: number): number {
  const millisecondsPerDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
  const date1 = new Date(timestamp1);
  const date2 = new Date(timestamp2);
  const timeDifference = Math.abs(date1.getTime() - date2.getTime());
  const dayDifference = Math.round(timeDifference / millisecondsPerDay);
  return dayDifference;
}

export function removeUndefinedObjects<T extends Record<string, any>>(
  obj: T
): Partial<T> {
  const filteredEntries = Object.entries(obj).filter(
    ([_, value]) => value !== undefined
  );
  return Object.fromEntries(filteredEntries) as Partial<T>;
}
