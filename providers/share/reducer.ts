import { createSlice } from "@reduxjs/toolkit";
import { 
  actionSaveSharedChat, 
  actionGetSharedChat, 
  actionUpdateSharedSettings,
  actionListSharedChats,
  actionRemoveSharedChat
} from "./actions";

// Definindo tipos para o estado
interface ChatMessage {
  role: string;
  content: string;
  timestamp?: number;
}

interface ChatThread {
  _id: string;
  value: {
    messages: ChatMessage[];
    status: string;
    'status-message'?: string;
    metadata?: {
      title?: string;
      description?: string;
      expiresAt?: number;
    }
  }
}

interface ShareState {
  list: {
    data: ChatThread[];
    status: string;
    error: null | any;
  };
  current: {
    data: ChatThread | null;
    status: string;
    error: null | any;
  };
  shareStatus: {
    lastSharedId: string | null;
    status: string;
    error: null | any;
  };
}

// Estado inicial
const initialState: ShareState = {
  // Lista de chats compartilhados
  list: {
    data: [] as ChatThread[],
    status: 'idle',
    error: null
  },
  // Chat compartilhado atual
  current: {
    data: null as ChatThread | null,
    status: 'idle',
    error: null
  },
  // Status da operação de compartilhamento
  shareStatus: {
    lastSharedId: null as string | null,
    status: 'idle',
    error: null
  }
};

// Slice para gerenciar o estado de compartilhamento
const shareSlice = createSlice({
  name: 'share',
  initialState,
  reducers: {
    // Reset dos estados
    resetShareStatus: (state) => {
      state.shareStatus = initialState.shareStatus;
    },
    resetCurrentChat: (state) => {
      state.current = initialState.current;
    }
  },
  extraReducers: (builder) => {
    // Salvar um chat para compartilhamento
    builder.addCase(actionSaveSharedChat.pending, (state) => {
      state.shareStatus.status = 'loading';
      state.shareStatus.error = null;
    });
    builder.addCase(actionSaveSharedChat.fulfilled, (state, action) => {
      state.shareStatus.status = 'succeeded';
      state.shareStatus.lastSharedId = action.payload.chatId;
    });
    builder.addCase(actionSaveSharedChat.rejected, (state, action) => {
      state.shareStatus.status = 'failed';
      state.shareStatus.error = action.payload as any;
    });

    // Buscar um chat compartilhado
    builder.addCase(actionGetSharedChat.pending, (state) => {
      state.current.status = 'loading';
      state.current.error = null;
    });
    builder.addCase(actionGetSharedChat.fulfilled, (state, action) => {
      state.current.status = 'succeeded';
      state.current.data = action.payload.chatData;
    });
    builder.addCase(actionGetSharedChat.rejected, (state, action) => {
      state.current.status = 'failed';
      state.current.error = action.payload as any;
    });

    // Atualizar configurações de compartilhamento
    builder.addCase(actionUpdateSharedSettings.pending, (state) => {
      state.shareStatus.status = 'loading';
      state.shareStatus.error = null;
    });
    builder.addCase(actionUpdateSharedSettings.fulfilled, (state) => {
      state.shareStatus.status = 'succeeded';
    });
    builder.addCase(actionUpdateSharedSettings.rejected, (state, action) => {
      state.shareStatus.status = 'failed';
      state.shareStatus.error = action.payload as any;
    });

    // Listar chats compartilhados
    builder.addCase(actionListSharedChats.pending, (state) => {
      state.list.status = 'loading';
      state.list.error = null;
    });
    builder.addCase(actionListSharedChats.fulfilled, (state, action) => {
      state.list.status = 'succeeded';
      state.list.data = action.payload.chats;
    });
    builder.addCase(actionListSharedChats.rejected, (state, action) => {
      state.list.status = 'failed';
      state.list.error = action.payload as any;
    });

    // Remover um chat compartilhado
    builder.addCase(actionRemoveSharedChat.pending, (state) => {
      state.shareStatus.status = 'loading';
      state.shareStatus.error = null;
    });
    builder.addCase(actionRemoveSharedChat.fulfilled, (state, action) => {
      state.shareStatus.status = 'succeeded';
      // Remove o chat da lista se ele estiver lá
      state.list.data = state.list.data.filter(
        (chat: any) => chat._id !== action.payload.chatId
      );
    });
    builder.addCase(actionRemoveSharedChat.rejected, (state, action) => {
      state.shareStatus.status = 'failed';
      state.shareStatus.error = action.payload as any;
    });
  }
});

// Exporta as actions
export const { resetShareStatus, resetCurrentChat } = shareSlice.actions;

// Exporta o reducer seguindo o padrão do projeto
const ShareReducer = { reducer: shareSlice.reducer };
export default ShareReducer;
