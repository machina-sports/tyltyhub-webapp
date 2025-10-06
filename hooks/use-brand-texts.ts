import { useBrandConfig } from '@/contexts/brand-context';

export function useBrandTexts() {
  const brand = useBrandConfig();

  return {
    // Chat texts
    chat: brand.content.chat || {
      titleOptions: ["¿Cuál va a ser tu apuesta?"],
      placeholder: "Pregúntame...",
      followUpPlaceholder: "¿Te gustó? ¿Quieres saber más? ¡Dímelo!",
      followUpTranscription: "¿Cómo puedo apostar?",
      preparing: "Preparando...",
      recording: "Grabando...",
      transcribing: "Transcribiendo...",
      noSuggestionsFound: "No se encontraron preguntas sugeridas en este momento.",
      mobileInputRows: 2,
      mobileInputPaddingBottom: "1.25rem"
    },

    // Offline texts
    offline: brand.content.offline || {
      title: "¡Volvemos pronto!",
      subtitle: "Es hora de mi pretemporada, amigo.",
      description: "Pronto estaré de vuelta con novedades.",
      ctaText: "Ir a bwin",
      ctaLink: "#",
      ctaLinkText: "Consulta aquí"
    },

    // Assistant texts
    assistant: {
      name: brand.id === 'sportingbet' ? 'SportingBOT' : 'Bot and Win',
      welcomeMessage: brand.id === 'sportingbet'
        ? "Olá! Eu sou o SportingBOT, seu assistente de apostas esportivas. Posso te ajudar com informações sobre partidas, odds, estatísticas e muito mais. Como posso ajudar?"
        : "Hello! I'm Bot and Win, your sports betting assistant. I can help you with match information, betting odds, statistics, and more. What would you like to know?"
    }
  };
}
