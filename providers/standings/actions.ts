import { createAsyncThunk } from "@reduxjs/toolkit"
import StandingsService from "./service"

export const FETCH_STANDINGS_REQUEST = 'FETCH_STANDINGS_REQUEST';
export const FETCH_STANDINGS_SUCCESS = 'FETCH_STANDINGS_SUCCESS';
export const FETCH_STANDINGS_FAILURE = 'FETCH_STANDINGS_FAILURE';

export const fetchStandingsRequest = () => ({
  type: FETCH_STANDINGS_REQUEST,
});

export const fetchStandingsSuccess = (data: any) => ({
  type: FETCH_STANDINGS_SUCCESS,
  payload: data,
});

export const fetchStandingsFailure = (error: any) => ({
  type: FETCH_STANDINGS_FAILURE,
  payload: error,
});

export const getStandings = async (_: void, thunkAPI: any) => {
  try {
    const response = await StandingsService.getStandings()
    return response
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error?.error || error?.message || error })
  }
}

export const fetchStandings = createAsyncThunk(
  'standings/fetchStandings',
  getStandings
) 