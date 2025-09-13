import bwinConfig from './bwin.json';
import sportingbetConfig from './sportingbet.json';

export interface BrandConfig {
  id: string;
  name: string;
  displayName: string;
  description: string;
  language: string;
  locale: string;
  domain: string;
  baseUrl: string;
  sportsBaseUrl: string;
  analytics: {
    ga4Primary: string;
    ga4Secondary: string;
    tallysightWorkspace: string;
  };
  branding: {
    colors: {
      primary: string;
      secondary: string;
      success: string;
      warning: string;
      danger: string;
      info: string;
    };
    fonts: {
      primary: string;
      fallback: string;
    };
    logo: {
      icon: string;
      full: string;
      alt: string;
    };
  };
  content: {
    title: string;
    description: string;
    ogImage: string;
    favicon: string;
    subtitle?: string;
    version?: string;
    navigation?: {
      chat: string;
      discover: string;
    };
    cta?: {
      register: string;
      login: string;
      registerText: string;
      loginText: string;
    };
    chat?: {
      titleOptions: string[];
      placeholder: string;
      followUpPlaceholder: string;
      followUpTranscription: string;
      preparing: string;
      recording: string;
      transcribing: string;
    };
    offline?: {
      title: string;
      subtitle: string;
      description: string;
      ctaText: string;
      ctaLink: string;
      ctaLinkText: string;
    };
  };
  features: {
    enableAvatar: boolean;
    enableBets: boolean;
    enableChat: boolean;
  };
  responsibleGaming: {
    enabled: boolean;
    text: string;
    image: string;
  };
}

export const brands: Record<string, BrandConfig> = {
  bwin: bwinConfig,
  sportingbet: sportingbetConfig,
};

export const getBrandConfig = (brandId?: string): BrandConfig => {
  const brand = brandId || process.env.NEXT_PUBLIC_BRAND || 'bwin';
  return brands[brand] || brands.bwin;
};

export const getAvailableBrands = (): string[] => {
  return Object.keys(brands);
};
