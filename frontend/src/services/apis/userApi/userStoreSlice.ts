import { CaseReducer, createSlice, PayloadAction } from '@reduxjs/toolkit';
import userStoreApi from './userStoreApi';

const initialState: UserStore = {
  pages: -1,
  allUsers: [],
  paginatedUsers: [],
  currentUser: {
    _id: '',
    name: '',
    email: '',
    roomID: '',
    ratings: [],
    role: 'USER',
    createdAt: '',
    updatedAt: '',
    checkedIn: false,
    lastCheckedIn: '',
    reservationID: '',
    lastCheckedOut: '',
    profileImageUrl: '',
    emailValidated: false
  }
};

type PaginatedUsersResponse = PaginatedResponse<User> | User[];
type ActionHandler<T> = CaseReducer<UserStore, PayloadAction<T>>;

const refreshAction: ActionHandler<PaginatedUsersResponse> = (state, { payload }) => {
  if ('docs' in payload) {
    // indicates paginated response
    return { ...state, paginatedUsers: payload.docs, pages: payload.pages };
  }
  return {
    ...state,
    allUsers: payload,
    paginatedUsers: state.paginatedUsers.filter(({ _id }) => payload.some(user => user._id === _id))
  };
};

const updateAction: ActionHandler<User> = (state, { payload }) => {
  const userToUpdateID: string = payload._id;
  let newState = { ...state };

  if (payload._id === state.currentUser._id || !state.currentUser._id) {
    newState.currentUser = payload;
  }

  const newUsers = [...newState.allUsers];
  const newPaginatedUsers = [...newState.paginatedUsers];

  const newUserToUpdateIndex: number = newUsers.findIndex(({ _id }) => _id === userToUpdateID);
  const paginatedUserToUpdateIndex: number = newPaginatedUsers.findIndex(
    ({ _id }) => _id === userToUpdateID
  );

  const newUserToUpdateFound: boolean = newUserToUpdateIndex > -1;
  const paginatedUserToUpdateFound: boolean = paginatedUserToUpdateIndex > -1;

  if (paginatedUserToUpdateFound) {
    newPaginatedUsers[paginatedUserToUpdateIndex] = payload;
    newState = { ...newState, paginatedUsers: newPaginatedUsers };
  }
  if (newUserToUpdateFound) {
    newUsers[newUserToUpdateIndex] = payload;
    newState = { ...newState, allUsers: newUsers };
  }

  return newState;
};

export const userStoreSlice = createSlice({
  name: 'userStore',
  initialState,
  reducers: {
    logout: () => initialState,
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      state = Object.assign(state, {
        ...state,
        currentUser: { ...state.currentUser, ...action.payload }
      });
    },
    updateUsers: (state, action: PayloadAction<Partial<Omit<UserStore, 'currentUser'>>>) => {
      state = Object.assign(state, { ...state, ...action.payload });
    }
  },
  extraReducers: builder => {
    // these are backend routes(endpoints) which when fufilled, return payloads that updates User object globally
    builder.addMatcher(userStoreApi.endpoints.login.matchFulfilled, updateAction);
    builder.addMatcher(userStoreApi.endpoints.register.matchFulfilled, updateAction);
    builder.addMatcher(userStoreApi.endpoints.getUsers.matchFulfilled, refreshAction);
    builder.addMatcher(userStoreApi.endpoints.updateUser.matchFulfilled, updateAction);
    builder.addMatcher(userStoreApi.endpoints.reserveSpace.matchFulfilled, updateAction);
    builder.addMatcher(userStoreApi.endpoints.deleteProfileImage.matchFulfilled, updateAction);
  }
});

export const { logout, updateUser, updateUsers } = userStoreSlice.actions;
export default userStoreSlice.reducer;
