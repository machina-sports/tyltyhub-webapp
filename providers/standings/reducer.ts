import { createSlice } from "@reduxjs/toolkit"
import { fetchStandings } from "./actions"

interface Competitor {
  abbreviation: string;
  country: string;
  country_code: string;
  form: string;
  gender: string;
  id: string;
  name: string;
}

interface Standing {
  change?: number;
  competitor: Competitor;
  current_outcome?: string;
  draw: number;
  goals_against: number;
  goals_diff: number;
  goals_for: number;
  loss: number;
  played: number;
  points: number;
  points_per_game: number;
  rank: number;
  win: number;
}

interface Group {
  group_name: string;
  id: string;
  live: boolean;
  name: string;
  stage: {
    end_date: string;
    order: number;
    phase: string;
    start_date: string;
    type: string;
    year: string;
  };
  standings: Standing[];
}

interface StandingsData {
  _id: string;
  created: string;
  metadata: {
    document_type: string;
    sid: string;
  };
  name: string;
  status: string | null;
  updated: string;
  value: {
    data: {
      groups: Group[];
      points_draw: number;
      points_loss: number;
      points_win: number;
      round: number;
      tie_break_rule: string;
      type: string;
    }[];
    execution: string;
    sid: string;
    status: string;
    title: string;
  };
}

interface StandingsState {
  data: StandingsData | null;
  status: string;
  error: string | null;
}

const initialState: StandingsState = {
  data: null,
  status: "loading",
  error: null
}

const StandingsReducer = createSlice({
  name: 'standings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStandings.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchStandings.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = "idle";
      })
      .addCase(fetchStandings.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  }
});

export default StandingsReducer; 