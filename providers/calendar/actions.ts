import {createAsyncThunk} from "@reduxjs/toolkit"
import calendarService from "./service"

export const FETCH_CALENDAR_REQUEST = "FETCH_CALENDAR_REQUEST"
export const FETCH_CALENDAR_SUCCESS = "FETCH_CALENDAR_SUCCESS"
export const FETCH_CALENDAR_FAILURE = "FETCH_TEAMS_FAILURE"

export const fetchCalendarRequest = () => ({
  type: FETCH_CALENDAR_REQUEST,
})

export const fetchCalendarSucess = (data: any) => ({
  type: FETCH_CALENDAR_SUCCESS,
  payload: data,
})

export const fetchCalendarFailure = (error: any) => ({
  type: FETCH_CALENDAR_FAILURE,
  payload: error,
})

interface SearchParams {
  filters: {
    name: string;
  };
  pagination: {
    page: number;
    page_size: number;
  };
  sorters: [string, number];
}

export const fetchCalendar = createAsyncThunk(
  "calendar/fetchCalendar",
  async (params: SearchParams, { rejectWithValue }) => {
    try {
      const response = await calendarService.getCalendar(params)
      return response
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)