import { CaseReducer, createSlice, PayloadAction } from '@reduxjs/toolkit';
import roomStoreApi from './roomStoreApi';

const initialState: RoomStore = { pages: -1, paginatedRooms: [], allRooms: [] };

type PaginatedRoomsResponse = PaginatedResponse | Room[];
type ActionHandler<T> = CaseReducer<RoomStore, PayloadAction<T>>;

const refreshAction: ActionHandler<PaginatedRoomsResponse> = (state, { payload }) => {
  if ('docs' in payload) {
    // indicates paginated response
    return { ...state, pages: payload.pages, paginatedRooms: payload.docs };
  }
  return {
    ...state,
    allRooms: payload,
    paginatedRooms: state.paginatedRooms.filter(({ _id }) => payload.some(room => room._id === _id))
  };
};

const updateAction: ActionHandler<Room> = (state, { payload }) => {
  const roomToUpdateID: string = payload._id;
  let newState = { ...state };

  const newRooms = [...newState.allRooms];
  const newPaginatedRooms = [...newState.paginatedRooms];

  const newRoomToUpdateIndex: number = newRooms.findIndex(({ _id }) => _id === roomToUpdateID);
  const paginatedRoomToUpdateIndex: number = newPaginatedRooms.findIndex(
    ({ _id }) => _id === roomToUpdateID
  );

  const newRoomToUpdateFound: boolean = newRoomToUpdateIndex > -1;
  const paginatedRoomToUpdateFound: boolean = paginatedRoomToUpdateIndex > -1;

  if (paginatedRoomToUpdateFound) {
    newPaginatedRooms[paginatedRoomToUpdateIndex] = payload;
    newState = { ...newState, paginatedRooms: newPaginatedRooms };
  }
  if (newRoomToUpdateFound) {
    newRooms[newRoomToUpdateIndex] = payload;
    newState = { ...newState, allRooms: newRooms };
  }

  return newState;
};

export const roomStoreSlice = createSlice({
  name: 'roomStore',
  initialState,
  reducers: {
    resetRooms: () => initialState,
    updateRooms: (state, action: PayloadAction<Partial<RoomStore>>) => {
      state = Object.assign(state, { ...state, ...action.payload });
    }
  },
  extraReducers: builder => {
    // these are backend routes(endpoints) which when fufilled, return payloads that updates RoomStore object globally
    builder.addMatcher(roomStoreApi.endpoints.getRooms.matchFulfilled, refreshAction);
    builder.addMatcher(roomStoreApi.endpoints.updateRoom.matchFulfilled, updateAction);
    builder.addMatcher(roomStoreApi.endpoints.createRoom.matchFulfilled, refreshAction);
    builder.addMatcher(roomStoreApi.endpoints.deleteRoom.matchFulfilled, refreshAction);
  }
});

export const { resetRooms, updateRooms } = roomStoreSlice.actions;
export default roomStoreSlice.reducer;
