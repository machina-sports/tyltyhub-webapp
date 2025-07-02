import {createSlice} from '@reduxjs/toolkit'
import { fetchCalendar } from './actions'

interface DiscoverState {
  data: Array<any>;
   filters: any;
  pagination: {
    page: number;
    page_size: number;
    total: number;
  };
  sorters: any[];
  status: string;
  error: string | null;
}

const initialState: DiscoverState = {
  data: [],
  filters: {
    name: 'soccer-game',
    'value.sport_event.sport_event_context.competition.id': 'sr:competition:357'
  },
  pagination: {
    page: 1,
    page_size: 10000,
    total: 0,
  },
  sorters: ['value.start_time', 1],
  // sorters: ['_id', -1],
  status: "loading",
  error: null
}

const CalendarReducer = createSlice({
  name: "calendar",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(fetchCalendar.pending, (state) => {
      state.status = "loading"
      state.error = null
    })
    .addCase(fetchCalendar.fulfilled, (state, action) => {
      state.data = action.payload
      state.status = "idle"
    })
    .addCase(fetchCalendar.rejected, (state, action) => {
      state.status = "failed"
      state.error = action.payload as string
    })
  }
})

export default CalendarReducer;