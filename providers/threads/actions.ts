import Service from "@/providers/threads/service"

// import { fetchAccessToken } from "@/containers/heygen/service"

import { createAsyncThunk } from "@reduxjs/toolkit"

export const doChat = async ({ thread_id, message }: { thread_id: string, message: string }) => {
  const response = await Service.chat({ thread_id, message })
  return response
}

export const doPlaceBet = async ({
  thread_id,
  bet_amount,
  bet_name,
  bet_odd,
  runner_name
}: {
  thread_id: string,
  bet_amount: number,
  bet_odd: number,
  bet_name: string,
  runner_name: string
}) => {
  const response = await Service.placeBet({
    thread_id,
    bet_amount,
    bet_name,
    bet_odd,
    runner_name
  })
  return response
}

export const doRetrieve = async ({ thread_id }: { thread_id: string }) => {
  const response = await Service.retrieve({ thread_id })
  return response
}

export const doSearch = async ({ filters, pagination, sorters }: { filters: any, pagination: any, sorters: any }) => {
  const response = await Service.search({ filters, pagination, sorters })
  return response
}

// export const heygenToken = async () => {
//   const response = await fetchAccessToken()
//   return response
// }


export const actionChat = createAsyncThunk('THREADS/DO_CHAT', doChat)

// export const actionHeygenToken = createAsyncThunk('THREADS/HEYGEN_TOKEN', heygenToken)

export const actionPlaceBet = createAsyncThunk('THREADS/PLACE_BET', doPlaceBet)

export const actionRetrieve = createAsyncThunk('THREADS/DO_RETRIEVE', doRetrieve)

export const actionSearch = createAsyncThunk('THREADS/DO_SEARCH', doSearch)

export const silentRetrieve = createAsyncThunk('THREADS/SILENT_RETRIEVE', doRetrieve)
