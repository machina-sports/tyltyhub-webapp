import { v4 as uuidv4 } from 'uuid';

// Tipos para melhor tipagem
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
      expiresAt?: number; // timestamp de expiração
    }
  }
}

// Duração padrão para chats compartilhados (7 dias em milisegundos)
const DEFAULT_EXPIRATION = 7 * 24 * 60 * 60 * 1000;

class ShareService {
  // Prefixo para localStorage
  private readonly STORAGE_KEY = 'sportingbet-cwc:shared-chats';
  
  /**
   * Salva um chat temporariamente para compartilhamento
   * @param chatData Os dados do chat a serem salvos
   * @param customExpiration Tempo de expiração personalizado (opcional)
   * @returns O ID do chat compartilhado
   */
  saveSharedChat(
    chatData: ChatThread,
    customExpiration?: number
  ): string {
    try {
      // Verifica se já temos um ID, senão gera um novo
      const chatId = chatData._id || uuidv4();
      
      // Adiciona metadados para o compartilhamento
      const chatToSave = {
        ...chatData,
        _id: chatId,
        value: {
          ...chatData.value,
          metadata: {
            ...chatData.value?.metadata,
            expiresAt: Date.now() + (customExpiration || DEFAULT_EXPIRATION),
            sharedAt: Date.now()
          }
        }
      };
      
      // Salvar no localStorage
      this.saveToLocalStorage(chatId, chatToSave);
      
      return chatId;
    } catch (error) {
      console.error('Erro ao salvar chat compartilhado:', error);
      throw new Error('Não foi possível compartilhar o chat');
    }
  }
  
  /**
   * Recupera um chat compartilhado pelo ID
   * @param chatId ID do chat compartilhado
   * @returns Dados do chat ou null se não encontrado ou expirado
   */
  getSharedChat(chatId: string): ChatThread | null {
    try {
      // Primeiro tenta buscar do localStorage
      const chatData = this.getFromLocalStorage(chatId);
      
      if (!chatData) return null;
      
      // Verifica se o chat expirou
      const expiresAt = chatData.value?.metadata?.expiresAt || 0;
      if (expiresAt && expiresAt < Date.now()) {
        // Chat expirado, remove do localStorage
        this.removeFromLocalStorage(chatId);
        return null;
      }
      
      return chatData;
    } catch (error) {
      console.error('Erro ao recuperar chat compartilhado:', error);
      return null;
    }
  }
  
  /**
   * Lista todos os chats compartilhados pelo usuário atual
   * @returns Array com todos os chats compartilhados
   */
  listSharedChats(): ChatThread[] {
    try {
      const allChats: Record<string, ChatThread> = this.getAllFromLocalStorage();
      const now = Date.now();
      
      // Filtra apenas chats válidos (não expirados)
      const validChats = Object.values(allChats).filter(chat => {
        const expiresAt = chat.value?.metadata?.expiresAt || 0;
        return !expiresAt || expiresAt > now;
      });
      
      return validChats;
    } catch (error) {
      console.error('Erro ao listar chats compartilhados:', error);
      return [];
    }
  }
  
  /**
   * Exclui um chat compartilhado
   * @param chatId ID do chat a ser excluído
   */
  removeSharedChat(chatId: string): boolean {
    try {
      this.removeFromLocalStorage(chatId);
      return true;
    } catch (error) {
      console.error('Erro ao remover chat compartilhado:', error);
      return false;
    }
  }
  
  /**
   * Atualiza as configurações de um chat compartilhado
   * @param chatId ID do chat
   * @param newExpiration Nova data de expiração (opcional)
   */
  updateSharedChatSettings(
    chatId: string,
    newExpiration?: number
  ): boolean {
    try {
      const chatData = this.getFromLocalStorage(chatId);
      if (!chatData) return false;
      
      // Atualiza os metadados
      chatData.value = {
        ...chatData.value,
        metadata: {
          ...chatData.value?.metadata,
          ...(newExpiration ? { expiresAt: newExpiration } : {})
        }
      };
      
      // Salva as alterações
      this.saveToLocalStorage(chatId, chatData);
      return true;
    } catch (error) {
      console.error('Erro ao atualizar configurações do chat:', error);
      return false;
    }
  }
  
  // Métodos privados para manipulação do localStorage
  
  private saveToLocalStorage(chatId: string, chatData: ChatThread): void {
    try {
      // Obtém todos os chats armazenados
      const allChats = this.getAllFromLocalStorage();
      
      // Adiciona/atualiza o chat específico
      allChats[chatId] = chatData;
      
      // Salva todos os chats de volta no localStorage
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allChats));
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error);
    }
  }
  
  private getFromLocalStorage(chatId: string): ChatThread | null {
    try {
      const allChats = this.getAllFromLocalStorage();
      return allChats[chatId] || null;
    } catch (error) {
      console.error('Erro ao recuperar do localStorage:', error);
      return null;
    }
  }
  
  private removeFromLocalStorage(chatId: string): void {
    try {
      const allChats = this.getAllFromLocalStorage();
      if (allChats[chatId]) {
        delete allChats[chatId];
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allChats));
      }
    } catch (error) {
      console.error('Erro ao remover do localStorage:', error);
    }
  }
  
  private getAllFromLocalStorage(): Record<string, ChatThread> {
    try {
      const storedData = localStorage.getItem(this.STORAGE_KEY);
      return storedData ? JSON.parse(storedData) : {};
    } catch (error) {
      console.error('Erro ao recuperar todos os chats do localStorage:', error);
      return {};
    }
  }
  
  /**
   * Limpa chats expirados do localStorage para conservar espaço
   */
  cleanupExpiredChats(): void {
    try {
      const allChats = this.getAllFromLocalStorage();
      const now = Date.now();
      let hasChanges = false;
      
      // Verifica cada chat se expirou
      Object.keys(allChats).forEach(chatId => {
        const expiresAt = allChats[chatId].value?.metadata?.expiresAt || 0;
        if (expiresAt && expiresAt < now) {
          delete allChats[chatId];
          hasChanges = true;
        }
      });
      
      // Se houve alterações, salva de volta no localStorage
      if (hasChanges) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allChats));
      }
    } catch (error) {
      console.error('Erro na limpeza de chats expirados:', error);
    }
  }
}

// Exporta uma instância singleton
const shareService = new ShareService();
export default shareService;
