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
      footer?: {
        width: number;
        height: number;
        className: string;
        mobile?: {
          width: number;
          height: number;
          className: string;
        };
      };
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
      assistantPlaceholder?: string;
      followUpPlaceholder: string;
      followUpTranscription: string;
      preparing: string;
      recording: string;
      transcribing: string;
      noSuggestionsFound?: string;
      mobileInputRows?: number;
      mobileInputPaddingBottom?: string;
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
    footer?: {
      disclaimer?: string;
      copyright?: string;
      oddsDisclaimer?: string;
      images?: {
        showImages: boolean;
        responsabilidad?: string;
        diversion?: string;
        age?: string;
        mano?: string;
        seguro?: string;
      };
    };
  };
  ageVerification?: {
    enabled: boolean;
    title: string;
    description: string;
    acceptText: string;
    rejectText: string;
    underageTitle: string;
    underageDescription: string;
    underageButtonText: string;
    headerBackgroundColor?: string;
    acceptButtonColor?: string;
    backdropOpacity?: string;
    modalBorder?: string;
  };
  privacy?: {
    lgpd?: {
      enabled: boolean;
      title: string;
      description: string;
      acceptText: string;
      dismissText: string;
      privacyPolicyUrl?: string;
      privacyPolicyText?: string;
    };
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
