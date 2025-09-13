import { BrandConfig } from '@/config/brands';

/**
 * Aplica as cores de hover a um elemento baseado na marca
 * Usa exatamente a mesma cor do botão "Cadastre-se Agora"
 * @param element - Elemento HTML a ser estilizado
 * @param brand - Configuração da marca atual
 */
export function applyBrandHoverColors(element: HTMLElement, brand: BrandConfig): void {
  // Pega a cor computada do botão "Cadastre-se Agora" para garantir que seja exatamente igual
  const ctaButton = document.querySelector('.sidebar-cta-button') as HTMLElement;
  if (ctaButton) {
    const computedStyle = getComputedStyle(ctaButton);
    element.style.backgroundColor = computedStyle.backgroundColor;
    element.style.color = computedStyle.color;
  } else {
    // Fallback caso não encontre o botão
    element.style.backgroundColor = 'hsl(var(--brand-primary))';
    element.style.color = 'white';
  }
}
