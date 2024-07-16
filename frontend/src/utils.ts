import { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export const toggleClass = (element?: HTMLElement | null, ...classes: string[]) => {
  if (element) classes.forEach(className => element.classList.toggle(className));
};

export const addClass = (element?: HTMLElement | null, ...classes: string[]) => {
  if (element) classes.forEach(className => element.classList.add(className));
};

export const removeClass = (element?: HTMLElement | null, ...classes: string[]) => {
  if (element) classes.forEach(className => element.classList.remove(className));
};

export const showAlert = ({
  msg,
  bgColor,
  textColor,
  zIndex = '0',
  duration = 3000
}: AlertProps) => {
  const alertDiv: HTMLDivElement = document.createElement('div');
  alertDiv.className = 'alert';
  addClass(
    alertDiv,
    'p-4',
    'fixed',
    'w-max',
    'mb-8',
    'left-1/2',
    'z-[9999]',
    'shadow-lg',
    'font-inter',
    'rounded-md',
    'text-[1rem]',
    'ease-in-out',
    'text-center',
    'max-w-[80vw]',
    'duration-500',
    'font-semibold',
    'transition-all',
    'text-swan-white',
    '-translate-x-1/2',
    'tracking-[0.04em]',
    'bg-lightning-yellow-900'
  );

  alertDiv.style.bottom = '-150px';
  document.body.appendChild(alertDiv);

  setTimeout(() => {
    if (bgColor) alertDiv.style.background = bgColor;
    if (textColor) alertDiv.style.color = textColor;
    alertDiv.innerHTML = msg;
    alertDiv.style.bottom = '0px';

    if (zIndex !== '0') alertDiv.style.zIndex = zIndex;

    setTimeout(() => {
      alertDiv.style.bottom = '-150px';
      setTimeout(() => document.body.removeChild(alertDiv), 1000);
    }, duration);
  }, 200);
};

export const formatInputText = ({
  text,
  regex,
  allowedChars,
  disallowedChars
}: FormatInputTextProps): string => {
  let newValue: string = text;
  const characters: string[] = text.split('');

  if (allowedChars) {
    newValue = characters.map(char => (allowedChars.includes(char) ? char : '')).join('');
  } else if (disallowedChars) {
    newValue = characters.map(char => (disallowedChars.includes(char) ? '' : char)).join('');
  } else if (regex) {
    // this tests each individual character and not the string as a whole
    newValue = characters.map(char => (regex.test(char) ? char : '')).join('');
  }

  return newValue;
};

export const getRndInteger = (min: number, max: number): number => {
  // returns a random integer from min to (max - 1)
  return Math.floor(Math.random() * (max - min)) + min;
};

export const secondsToMMSS = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secondsLeft = seconds % 60;

  return `${minutes.toString().padStart(2, '0')}:${secondsLeft.toString().padStart(2, '0')}`;
};

/**
 * Returns an object containing shortName and name of the day of the week.
 * @param index A integer from 0 to 6.
 */
export const getDayDetails = (index: number): DayDetail | undefined => {
  const dayDetails: { [key: number]: DayDetail } = {
    0: { name: 'Sunday', shortName: 'Sun' },
    1: { name: 'Monday', shortName: 'Mon' },
    2: { name: 'Tuesday', shortName: 'Tue' },
    3: { name: 'Wednesday', shortName: 'Wed' },
    4: { name: 'Thursday', shortName: 'Thu' },
    5: { name: 'Friday', shortName: 'Fri' },
    6: { name: 'Saturday', shortName: 'Sat' }
  };

  return dayDetails[index];
};

/**
 * Returns an object containing shortName and name of a month.
 * @param index An integer from 0 to 11.
 */
export const getMonthDetails = (index: number): MonthDetail | undefined => {
  const monthDetails: { [key: number]: MonthDetail } = {
    0: { name: 'January', shortName: 'Jan' },
    1: { name: 'February', shortName: 'Feb' },
    2: { name: 'March', shortName: 'Mar' },
    3: { name: 'April', shortName: 'Apr' },
    4: { name: 'May', shortName: 'May' },
    5: { name: 'June', shortName: 'Jun' },
    6: { name: 'July', shortName: 'Jul' },
    7: { name: 'August', shortName: 'Aug' },
    8: { name: 'September', shortName: 'Sep' },
    9: { name: 'October', shortName: 'Oct' },
    10: { name: 'November', shortName: 'Nov' },
    11: { name: 'December', shortName: 'Dec' }
  };

  return monthDetails[index];
};

export const getDateProps = (date?: string | number | Date): DateProps => {
  const dateObject: Date = date ? new Date(date) : new Date();

  const dayIndex: number = dateObject.getDay();
  const year: number = dateObject.getFullYear();
  const monthDate: number = dateObject.getDate();
  const minutes: number = dateObject.getMinutes();
  const seconds: number = dateObject.getSeconds();
  const monthIndex: number = dateObject.getMonth();
  const milliseconds: number = dateObject.getMilliseconds();
  const millisecondsFromInception: number = dateObject.getTime();

  const hour24: number = dateObject.getHours();
  const hour12: number = hour24 < 12 ? hour24 : hour24 - 12;
  const am_or_pm: 'am' | 'pm' = hour24 < 12 ? 'am' : 'pm';

  const { name: longMonthName, shortName: shortMonthName }: MonthDetail =
    getMonthDetails(monthIndex)!;

  const { name: longDayOfWeek, shortName: shortDayOfWeek }: DayDetail = getDayDetails(dayIndex)!;

  return {
    year,
    hour12,
    hour24,
    minutes,
    seconds,
    am_or_pm,
    monthDate,
    milliseconds,
    longMonthName,
    longDayOfWeek,
    shortDayOfWeek,
    shortMonthName,
    month: monthIndex + 1,
    dayOfWeek: dayIndex + 1,
    millisecondsFromInception
  };
};

export const checkArrayEquality = (array1: any[], array2: any[]): boolean => {
  let arraysAreSameLength: boolean = array1.length === array2.length;

  if (!arraysAreSameLength) {
    return false;
  }

  for (let i = 0; i < array1.length; i++) {
    if (!array2.includes(array1[i])) {
      return false;
    }
  }
  for (let j = 0; j < array2.length; j++) {
    if (!array1.includes(array2[j])) {
      return false;
    }
  }

  return true;
};

export const handleReduxQueryError = (
  isError: boolean,
  error?: FetchBaseQueryError | SerializedError,
  onError?: () => void
) => {
  if (isError && error && 'status' in error) {
    showAlert({ msg: `${error.data ?? ''}` });
    console.error(error);
    onError?.();
  }
};

export const isDarkMode = () => window.matchMedia?.('(prefers-color-scheme: dark)').matches;
