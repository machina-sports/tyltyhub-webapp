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
      transcribing: "Transcribiendo..."
    },
    
    // Offline texts
    offline: brand.content.offline || {
      title: "¡Volvemos pronto!",
      subtitle: "Es hora de mi pretemporada, amigo.",
      description: "Pronto estaré de vuelta con novedades.",
      ctaText: "Ir a bwin",
      ctaLink: "#",
      ctaLinkText: "Consulta aquí"
    }
  };
}
