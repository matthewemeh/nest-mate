interface MongoInterface {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

interface Entry extends MongoInterface {
  roomID: string;
  userID: string;
  type: EntryStatus;
}

interface Reservation extends MongoInterface {
  userID: string;
  roomID: string;
  status: ReservationStatus;
}

interface Rating extends MongoInterface {
  value: number;
  roomID: string;
  userID: string;
}

interface User extends MongoInterface {
  role: Role;
  name: string;
  email: string;
  roomID?: string;
  ratings: Rating[];
  checkedIn: boolean;
  lastCheckedIn: string;
  reservationID: string;
  lastCheckedOut: string;
  emailValidated: boolean;
  profileImageUrl: string;
}

interface Room extends MongoInterface {
  floor: number;
  hostelID: string;
  ratings: Rating[];
  occupants: User[];
  roomNumber: number;
  maxOccupants: number;
  roomImageUrl: string;
  reservations: Reservation[];
}

interface Hostel extends MongoInterface {
  name: string;
  rooms: Room[];
  floors: number;
  hostelImageUrl: string;
}

interface UserData {
  isOtpVerified: boolean;
  isAuthenticated: boolean;
  prefersDarkMode: boolean;
}

interface PaginatedResponse {
  docs: any[];
  page: number;
  total: number;
  limit: number;
  pages: number;
}

interface UserStore {
  pages: number;
  allUsers: User[];
  currentUser: User;
  paginatedUsers: User[];
}

interface ReservationStore {
  pages: number;
  allReservations: Reservation[];
  paginatedReservations: Reservation[];
}

interface RoomStore {
  pages: number;
  allRooms: Room[];
  paginatedRooms: Room[];
}

interface HostelStore {
  pages: number;
  allHostels: Hostel[];
  paginatedHostels: Hostel[];
}

interface OtpDetails {
  otp: string;
  encryptedOtp: string;
}

interface StoredOtpDetails {
  otp: string;
  expiresAt: number;
}

interface DayDetail {
  name: DayLongName;
  shortName: DayShortName;
}

interface MonthDetail {
  name: MonthLongName;
  shortName: MonthShortName;
}

interface DateProps {
  year: number;
  month: number;
  hour12: number;
  hour24: number;
  minutes: number;
  seconds: number;
  dayOfWeek: number;
  monthDate: number;
  milliseconds: number;
  am_or_pm: 'am' | 'pm';
  longDayOfWeek: DayLongName;
  shortDayOfWeek: DayShortName;
  longMonthName: MonthLongName;
  shortMonthName: MonthShortName;
  millisecondsFromInception: number;
}
