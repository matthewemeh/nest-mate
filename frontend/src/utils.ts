import { encrypt, decrypt } from 'n-krypta';
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
  alertDiv.id = 'alert';
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
  const persistRoot = JSON.parse(localStorage.getItem('persist:root') ?? '{}');
  const persistRootObject = JSON.parse(persistRoot.userData ?? '{}');
  const { prefersDarkMode } = persistRootObject;
  prefersDarkMode && addClass(alertDiv, 'dark:bg-zircon', 'dark:text-lightning-yellow-900');

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

export const swapElements = (array: any[], index1: number, index2: number) => {
  try {
    [array[index1], array[index2]] = [array[index2], array[index1]];
  } catch (error) {
    console.error(error);
  }
};

export const rearrangeElements = (array: any[], sourceIndex: number, destinationIndex: number) => {
  const blockDifference: number = sourceIndex - destinationIndex;
  const isBlockMovingUp: boolean = blockDifference > 0;
  const isBlockMovingDown: boolean = blockDifference < 0;

  if (isBlockMovingDown) {
    for (let i = sourceIndex; i < destinationIndex; i++) {
      swapElements(array, i, i + 1);
    }
  } else if (isBlockMovingUp) {
    for (let i = sourceIndex; i > destinationIndex; i--) {
      swapElements(array, i, i - 1);
    }
  }
};

export const getRndInteger = (min: number, max: number): number => {
  // returns a random integer from min to (max - 1)
  return Math.floor(Math.random() * (max - min)) + min;
};

export const getOtp = (digits: number): string => {
  let otp = '';
  for (let i = 0; i < digits; i++) otp += getRndInteger(0, 10).toString();
  return otp;
};

export const generateOTP = (n: number): OtpDetails => {
  const otp: string = getOtp(n);
  const secret: string = process.env.REACT_APP_OTP_SECRET_KEY!;
  const ENCRYPTION_CYCLE: number = Number(process.env.REACT_APP_OTP_ENCRYPTION_CYCLE!);

  const encryptedOtp = encrypt(otp, secret, ENCRYPTION_CYCLE);
  return { otp, encryptedOtp };
};

export const decryptString = (encryptedString: string): string => {
  const secret: string = process.env.REACT_APP_OTP_SECRET_KEY!;
  const ENCRYPTION_CYCLE: number = Number(process.env.REACT_APP_OTP_ENCRYPTION_CYCLE!);

  let decryptedString = encryptedString;
  for (let i = 0; i < ENCRYPTION_CYCLE; i++) {
    decryptedString = decrypt(decryptedString, secret);
  }
  return decryptedString;
};

export const validateOTP = (enteredOtp: string, encryptedOtp: string): boolean => {
  let decryptedString = decryptString(encryptedOtp);

  return enteredOtp === decryptedString;
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

export const minifyViews = (views: number): string => {
  const oneBillion = 1_000_000_000;
  const hundredMillion = 100_000_000;
  const tenMillion = 10_000_000;
  const oneMillion = 1_000_000;
  const hundredThousand = 100_000;
  const tenThousand = 10_000;
  const oneThousand = 1_000;

  const viewsString: string = views.toString();

  if (views >= oneBillion) {
    return `${viewsString.substring(0, 1)}.${viewsString.substring(1, 2)}B`;
  } else if (views >= hundredMillion && views < oneBillion) {
    return `${viewsString.substring(0, 3)}M`;
  } else if (views >= tenMillion && views < hundredMillion) {
    return `${viewsString.substring(0, 2)}M`;
  } else if (views >= oneMillion && views < tenMillion) {
    return `${viewsString.substring(0, 1)}.${viewsString.substring(1, 2)}M`;
  } else if (views >= hundredThousand && views < oneMillion) {
    return `${viewsString.substring(0, 3)}K`;
  } else if (views >= tenThousand && views < hundredThousand) {
    return `${viewsString.substring(0, 2)}K`;
  } else if (views >= oneThousand && views < tenThousand) {
    return `${viewsString.substring(0, 1)}.${viewsString.substring(1, 2)}K`;
  } else {
    return views.toLocaleString('en');
  }
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
  error?: FetchBaseQueryError | SerializedError
) => {
  if (isError && error && 'status' in error) {
    showAlert({ msg: `${error.data ?? ''}` });
    console.error(error);
  }
};
