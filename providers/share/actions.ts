import { createAsyncThunk } from "@reduxjs/toolkit";
import shareService from "./service";

export const actionSaveSharedChat = createAsyncThunk(
  'share/save',
  async ({ 
    chatData, 
    expirationDays
  }: { 
    chatData: any, 
    expirationDays?: number 
  }, { rejectWithValue }) => {
    try {
      const customExpiration = expirationDays ? expirationDays * 24 * 60 * 60 * 1000 : undefined;
      
      const chatId = shareService.saveSharedChat(
        chatData, 
        customExpiration
      );
      
      return { chatId, success: true };
    } catch (error: any) {
      return rejectWithValue({
        message: error.message || 'Falha ao compartilhar o chat',
        success: false
      });
    }
  }
);

export const actionGetSharedChat = createAsyncThunk(
  'share/get',
  async ({ chatId }: { chatId: string }, { rejectWithValue }) => {
    try {
      const chatData = shareService.getSharedChat(chatId);
      
      if (!chatData) {
        return rejectWithValue({
          message: 'Chat não encontrado ou expirado',
          success: false
        });
      }
      
      return { chatData, success: true };
    } catch (error: any) {
      return rejectWithValue({
        message: error.message || 'Falha ao recuperar o chat compartilhado',
        success: false
      });
    }
  }
);

export const actionUpdateSharedSettings = createAsyncThunk(
  'share/update',
  async ({ 
    chatId, 
    expirationDays 
  }: { 
    chatId: string, 
    expirationDays?: number 
  }, { rejectWithValue }) => {
    try {
      const newExpiration = expirationDays 
        ? Date.now() + (expirationDays * 24 * 60 * 60 * 1000) 
        : undefined;
      
      const success = shareService.updateSharedChatSettings(
        chatId, 
        newExpiration
      );
      
      if (!success) {
        return rejectWithValue({
          message: 'Falha ao atualizar configurações do chat',
          success: false
        });
      }
      
      return { success: true };
    } catch (error: any) {
      return rejectWithValue({
        message: error.message || 'Falha ao atualizar configurações do chat',
        success: false
      });
    }
  }
);

export const actionListSharedChats = createAsyncThunk(
  'share/list',
  async (_, { rejectWithValue }) => {
    try {
      shareService.cleanupExpiredChats();
      
      const chats = shareService.listSharedChats();
      
      return { chats, success: true };
    } catch (error: any) {
      return rejectWithValue({
        message: error.message || 'Falha ao listar chats compartilhados',
        success: false
      });
    }
  }
);

export const actionRemoveSharedChat = createAsyncThunk(
  'share/remove',
  async ({ chatId }: { chatId: string }, { rejectWithValue }) => {
    try {
      const success = shareService.removeSharedChat(chatId);
      
      if (!success) {
        return rejectWithValue({
          message: 'Falha ao remover chat compartilhado',
          success: false
        });
      }
      
      return { chatId, success: true };
    } catch (error: any) {
      return rejectWithValue({
        message: error.message || 'Falha ao remover chat compartilhado',
        success: false
      });
    }
  }
);
