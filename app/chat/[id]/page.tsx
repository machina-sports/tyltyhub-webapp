import ContainerView from "@/components/chat/container-view"
import ShareProvider from "@/providers/share/provider"
import ThreadProvider from "@/providers/threads/provider"
import { getBrandConfig } from "@/config/brands"

// Metadata generation for improved sharing experience
export async function generateMetadata({ params }: { params: { id: string } }) {
  const id = params.id
  
  // Get brand configuration
  const brandId = process.env.NEXT_PUBLIC_BRAND || 'bwin';
  const brand = getBrandConfig(brandId);
  
  return {
    title: `${brand.displayName} | Chat`,
    description: brand.description,
    openGraph: {
      title: `${brand.displayName} | Chat`,
      description: brand.description,
      type: 'website',
      locale: brand.locale,
      siteName: brand.displayName,
      images: [
        {
          url: brand.content.ogImage,
          width: 980,
          height: 250,
          alt: brand.displayName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${brand.displayName} | Chat`,
      description: brand.description,
      images: [brand.content.ogImage],
    }
  }
}

export default function ChatPage({
  params,
}: {
  params: { id?: string }
}) {
  return (
    <ThreadProvider>
      <ShareProvider>
        <ContainerView threadId={params.id || ''} />
      </ShareProvider>
    </ThreadProvider>
  )
}
