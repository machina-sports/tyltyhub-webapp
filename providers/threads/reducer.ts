import {
  actionChat,
  actionPlaceBet,
  actionRetrieve,
  actionSearch,
  silentRetrieve
} from "@/providers/threads/actions"

import { PayloadAction, createSlice } from "@reduxjs/toolkit"

export interface InitialStateProps {
  fields: {
    message: string;
    status: 'idle' | 'loading' | 'failed';
  };
  item: {
    data: {};
    status: 'idle' | 'loading' | 'failed';
  },
  list: {
    filters: {
      name: string;
      user_id: string;
    };
    items: any[];
    pagination: {
      page: number;
      pageSize: number;
      total: number;
    };
    sorters: any[];
    status: 'idle' | 'loading' | 'failed';
  };
  status: 'idle' | 'loading' | 'failed';
  video: {
    isLoading: boolean;
    isPlaying: boolean;
    status: 'idle' | 'loading' | 'failed';
    token?: any;
  };
}

const initialState: InitialStateProps = {
  fields: {
    message: '',
    status: 'idle'
  },
  item: {
    data: {},
    status: 'idle'
  },
  list: {
    filters: {
      name: 'thread',
      user_id: ''
    },
    items: [],
    pagination: {
      page: 1,
      pageSize: 10,
      total: 0,
    },
    sorters: ['_id', -1],
    status: 'loading'
  },
  status: 'idle',
  video: {
    isLoading: false,
    isPlaying: false,
    status: 'idle',
    token: '',
  },
}

const CustomReducer = createSlice({
  name: 'threads',
  initialState: initialState,
  reducers: {
    clear: (state) => {
      state = initialState
    },
    setItemStatus: (state: any, action: PayloadAction<any>) => {
      state.item.data.value.status = action.payload
    },
    setListStatus: (state: any, action: PayloadAction<any>) => {
      state.list.status = action.payload
    },
    setVideoToken: (state: any, action: PayloadAction<any>) => {
      state.video.token = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // actionChat
      .addCase(actionChat.pending, (state) => {
        state.fields.status = 'loading'
      })
      .addCase(actionChat.fulfilled, (state: any, action) => {
        state.item.data = action.payload?.data || {}
        state.fields.status = 'idle'
      })
      .addCase(actionChat.rejected, (state) => {
        state.fields.status = 'failed'
      })
      // actionPlaceBet
      .addCase(actionPlaceBet.pending, (state) => {
        state.fields.status = 'loading'
      })
      .addCase(actionPlaceBet.fulfilled, (state: any, action) => {
        state.fields.status = 'idle'
      })
      .addCase(actionPlaceBet.rejected, (state) => {
        state.fields.status = 'failed'
      })
      // actionRetrieve
      .addCase(actionRetrieve.pending, (state) => {
        state.item.data = {}
        state.item.status = 'loading'
        state.list.items = []
        state.list.status = 'loading'
      })
      .addCase(actionRetrieve.fulfilled, (state: any, action) => {
        state.item.data = action.payload?.data || {}
        state.item.status = 'idle'
      })
      .addCase(actionRetrieve.rejected, (state) => {
        state.item.status = 'failed'
      })
      // actionSearch
      .addCase(actionSearch.pending, (state) => {
        state.list.items = []
        state.list.status = 'loading'
        state.item.data = {}
        state.item.status = 'loading'
      })
      .addCase(actionSearch.fulfilled, (state: any, action) => {
        state.list.items = action.payload?.data || []
        state.list.pagination.total = action.payload?.total_documents || 0
        state.list.status = 'idle'
      })
      .addCase(actionSearch.rejected, (state) => {
        state.list.status = 'failed'
      })
      // silentRetrieve
      .addCase(silentRetrieve.pending, (state) => {
        // state.item.status = 'loading'
      })
      .addCase(silentRetrieve.fulfilled, (state: any, action) => {
        state.item.data = action.payload?.data || {}
        // state.item.status = 'idle'
      })
      .addCase(silentRetrieve.rejected, (state) => {
        state.item.status = 'failed'
      })
  },
})

export const {
  clear,
  setItemStatus,
  setListStatus,
  setVideoToken,
} = CustomReducer.actions

export default CustomReducer
