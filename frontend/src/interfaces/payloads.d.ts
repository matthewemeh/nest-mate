interface UserRegisterPayload {
  role?: Role;
  name: string;
  email: string;
  password: string;
  profileImage?: File;
}

interface UserUpdatePayload {
  _id: string;
  role?: Role;
  name?: string;
  userID: string;
  roomID?: string;
  password?: string;
  profileImage?: File;
  emailValidated?: boolean;
}

interface UserLoginPayload {
  email: string;
  password: string;
}

interface GetUsersPayload {
  userID: string;
  params?: Record<string, any>;
}

interface GetUserPayload {
  _id: string;
  params?: Record<string, any>;
}

interface DeleteUserPayload {
  _id: string;
  userID: string;
}

interface DeleteProfileImagePayload {
  _id: string;
  userID: string;
}

interface CreateRoomPayload {
  userID: string;
  floor?: number;
  roomImage?: File;
  hostelID: string;
  roomNumber: number;
  maxOccupants?: number;
}

interface UpdateRoomPayload {
  _id: string;
  floor?: number;
  userID: string;
  roomImage?: File;
  roomNumber?: number;
  newHostelID?: string;
  occupantID?: string;
  maxOccupants?: number;
}

interface GetRoomPayload {
  _id: string;
}

interface GetRoomsPayload {
  params?: Record<string, any>;
}

interface DeleteRoomPayload {
  _id: string;
  userID: string;
  hostelID: string;
}

interface CreateHostelPayload {
  name: string;
  userID: string;
  floors?: number;
  hostelImage?: File;
}

interface UpdateHostelPayload {
  _id: string;
  name?: string;
  userID: string;
  floors?: number;
  hostelImage?: File;
}

interface GetHostelPayload {
  _id: string;
}

interface GetHostelsPayload {
  params?: Record<string, any>;
}

interface DeleteHostelPayload {
  _id: string;
  userID: string;
  params?: Record<string, any>;
}

interface EmailSendPayload {
  to: string;
  text?: string;
  html?: string;
  subject?: string;
}

interface RatingFetchPayload {
  roomID: string;
  userID: string;
}

interface RatingUpdatePayload {
  value: number;
  roomID: string;
  userID: string;
  hostelID: string;
}

interface ReserveSpacePayload {
  userID: string;
  roomID: string;
  hostelID: string;
}

interface ReservationPayload {
  adminID: string;
  reservationID: string;
}

interface EntryPayload {
  _id: string;
  roomID: string;
  userID: string;
  hostelID: string;
}

interface GetReservationsPayload {
  params?: Record<string, any>;
}

interface GetReservationsLengthPayload {
  params?: Record<string, any>;
}

interface GetEntriesPayload {
  params?: Record<string, any>;
}
