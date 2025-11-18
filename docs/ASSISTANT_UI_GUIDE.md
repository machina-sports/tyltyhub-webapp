1. Usuário abre a página
   └─> provider.tsx chama /api/thread/register
       └─> Cria novo thread no MongoDB
       └─> Retorna threadId

2. Usuário envia mensagem "Quais são os próximos jogos?"
   └─> streaming-adapter.ts chama /api/thread/stream
       └─> route.ts faz proxy para machina-client-api
       └─> Backend Flask chama agente tyltyhub-chat-assistant
       └─> Agente executa workflows e retorna streaming NDJSON
       └─> Frontend recebe e renderiza em tempo real

3. Usuário recarrega a página ou abre thread antigo
   └─> Componente chama /api/thread/[id]
       └─> Busca mensagens antigas do MongoDB
       └─> Renderiza histórico completo