import { CaseReducer, createSlice, PayloadAction } from '@reduxjs/toolkit';
import reservationStoreApi from './reservationStoreApi';

const initialState: ReservationStore = {
  pages: -1,
  allReservations: [],
  paginatedReservations: []
};

type PaginatedReservationsResponse = PaginatedResponse<Reservation> | Reservation[];
type ActionHandler<T> = CaseReducer<ReservationStore, PayloadAction<T>>;

const refreshAction: ActionHandler<PaginatedReservationsResponse> = (state, { payload }) => {
  if ('docs' in payload) {
    // indicates paginated response
    return { ...state, paginatedReservations: payload.docs, pages: payload.pages };
  }
  return {
    ...state,
    allReservations: payload,
    paginatedReservations: state.paginatedReservations.filter(({ _id }) =>
      payload.some(user => user._id === _id)
    )
  };
};

const updateAction: ActionHandler<Reservation> = (state, { payload }) => {
  const reservationToUpdateID: string = payload._id;
  let newState = { ...state };

  const newReservations = [...newState.allReservations];
  const newPaginatedReservations = [...newState.paginatedReservations];

  const newReservationToUpdateIndex: number = newReservations.findIndex(
    ({ _id }) => _id === reservationToUpdateID
  );
  const paginatedReservationToUpdateIndex: number = newPaginatedReservations.findIndex(
    ({ _id }) => _id === reservationToUpdateID
  );

  const newReservationToUpdateFound: boolean = newReservationToUpdateIndex > -1;
  const paginatedReservationToUpdateFound: boolean = paginatedReservationToUpdateIndex > -1;

  if (paginatedReservationToUpdateFound) {
    newPaginatedReservations[paginatedReservationToUpdateIndex] = payload;
    newState = { ...newState, paginatedReservations: newPaginatedReservations };
  }
  if (newReservationToUpdateFound) {
    newReservations[newReservationToUpdateIndex] = payload;
    newState = { ...newState, allReservations: newReservations };
  }

  return newState;
};

export const reservationStoreSlice = createSlice({
  name: 'reservationStore',
  initialState,
  reducers: {
    resetReservations: () => initialState,
    updateReservations: (state, action: PayloadAction<Partial<ReservationStore>>) => {
      state = Object.assign(state, { ...state, ...action.payload });
    }
  },
  extraReducers: builder => {
    // these are backend routes(endpoints) which when fufilled, return payloads that updates Reservation object globally
    builder.addMatcher(reservationStoreApi.endpoints.getReservations.matchFulfilled, refreshAction);
  }
});

export const { resetReservations, updateReservations } = reservationStoreSlice.actions;
export default reservationStoreSlice.reducer;
