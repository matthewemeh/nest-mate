import { CaseReducer, createSlice, PayloadAction } from '@reduxjs/toolkit';
import hostelStoreApi from './hostelStoreApi';

const initialState: HostelStore = { pages: -1, paginatedHostels: [], allHostels: [] };

type PaginatedHostelsResponse = PaginatedResponse | Hostel[];
type ActionHandler<T> = CaseReducer<HostelStore, PayloadAction<T>>;

const refreshAction: ActionHandler<PaginatedHostelsResponse> = (state, { payload }) => {
  if ('docs' in payload) {
    // indicates paginated response
    return { ...state, pages: payload.pages, paginatedHostels: payload.docs };
  }
  return {
    ...state,
    allHostels: payload,
    paginatedHostels: state.paginatedHostels.filter(({ _id }) =>
      payload.some(hostel => hostel._id === _id)
    )
  };
};

const updateAction: ActionHandler<Hostel> = (state, { payload }) => {
  const hostelToUpdateID: string = payload._id;
  let newState = { ...state };

  const newHostels = [...newState.allHostels];
  const newPaginatedHostels = [...newState.paginatedHostels];

  const newHostelToUpdateIndex: number = newHostels.findIndex(
    ({ _id }) => _id === hostelToUpdateID
  );
  const paginatedHostelToUpdateIndex: number = newPaginatedHostels.findIndex(
    ({ _id }) => _id === hostelToUpdateID
  );

  const newHostelToUpdateFound: boolean = newHostelToUpdateIndex > -1;
  const paginatedHostelToUpdateFound: boolean = paginatedHostelToUpdateIndex > -1;

  if (paginatedHostelToUpdateFound) {
    newPaginatedHostels[paginatedHostelToUpdateIndex] = payload;
    newState = { ...newState, paginatedHostels: newPaginatedHostels };
  }
  if (newHostelToUpdateFound) {
    newHostels[newHostelToUpdateIndex] = payload;
    newState = { ...newState, allHostels: newHostels };
  }

  return newState;
};

export const hostelStoreSlice = createSlice({
  name: 'hostelStore',
  initialState,
  reducers: {
    resetHostels: () => initialState,
    updateHostels: (state, action: PayloadAction<Partial<HostelStore>>) => {
      state = Object.assign(state, { ...state, ...action.payload });
    }
  },
  extraReducers: builder => {
    // these are backend routes(endpoints) which when fufilled, return payloads that updates HostelStore object globally
    builder.addMatcher(hostelStoreApi.endpoints.getHostels.matchFulfilled, refreshAction);
    builder.addMatcher(hostelStoreApi.endpoints.updateHostel.matchFulfilled, updateAction);
    builder.addMatcher(hostelStoreApi.endpoints.createHostel.matchFulfilled, refreshAction);
    builder.addMatcher(hostelStoreApi.endpoints.deleteHostel.matchFulfilled, refreshAction);
  }
});

export const { resetHostels, updateHostels } = hostelStoreSlice.actions;
export default hostelStoreSlice.reducer;
