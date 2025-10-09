import { Metadata } from "next"
import ChatClientLayout from "./client-layout"
import { getBrandConfig } from "@/config/brands"
import { generateBrandMetadata } from "@/lib/metadata"

const brand = getBrandConfig()
const { metadata: brandMetadata } = generateBrandMetadata(brand)

export const metadata: Metadata = {
  ...brandMetadata,
  title: `Chat | ${brand.displayName}`,
  description: `Conversa con ${brand.content.subtitle}. Resuelve dudas, consulta cuotas y realiza tus apuestas.`,
  openGraph: {
    ...brandMetadata.openGraph,
    title: `Chat | ${brand.displayName}`,
    description: `Conversa con ${brand.content.subtitle}. Resuelve dudas, consulta cuotas y realiza tus apuestas.`,
  },
  twitter: {
    ...brandMetadata.twitter,
    title: `Chat | ${brand.displayName}`,
    description: `Conversa con ${brand.content.subtitle}. Resuelve dudas, consulta cuotas y realiza tus apuestas.`,
  },
}

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ChatClientLayout>{children}</ChatClientLayout>
}