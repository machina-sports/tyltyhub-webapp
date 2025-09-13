import { BrandConfig } from '@/config/brands';

export function generateBrandMetadata(brand: BrandConfig): {
  metadata: any;
  viewport: any;
} {
  return {
    metadata: {
      title: brand.content.title,
      description: brand.content.description,
      icons: {
        icon: brand.content.favicon,
      },
      openGraph: {
        title: brand.content.title,
        description: brand.content.description,
        type: "website",
        locale: brand.locale,
        siteName: brand.displayName,
        url: brand.baseUrl,
        images: [
          {
            url: brand.content.ogImage,
            width: 1200,
            height: 630,
            alt: brand.displayName,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: brand.content.title,
        description: brand.content.description,
        images: [brand.content.ogImage],
      },
    },
    viewport: {
      width: 'device-width',
      initialScale: 1,
      maximumScale: 1,
      userScalable: false,
      viewportFit: 'cover', // iOS safe area support
    }
  };
}
