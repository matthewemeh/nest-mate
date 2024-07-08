type Booleanish = boolean | 'true' | 'false';

type Role = 'USER' | 'ADMIN' | 'SUPER_ADMIN';

type EntryStatus = 'CHECK_IN' | 'CHECK_OUT';

type ReservationStatus = 'PENDING' | 'DECLINED' | 'CONFIRMED';

type MonthLongName =
  | 'January'
  | 'February'
  | 'March'
  | 'April'
  | 'May'
  | 'June'
  | 'July'
  | 'August'
  | 'September'
  | 'October'
  | 'November'
  | 'December';

type MonthShortName =
  | 'Jan'
  | 'Feb'
  | 'Mar'
  | 'Apr'
  | 'May'
  | 'Jun'
  | 'Jul'
  | 'Aug'
  | 'Sep'
  | 'Oct'
  | 'Nov'
  | 'Dec';

type DayLongName =
  | 'Sunday'
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday';

type DayShortName = 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';
