import SiteOffline from "@/components/site-offline"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Site Fora do Ar | SportingBOT",
  description: "SportingBOT está temporariamente fora do ar para manutenção. Confira as promoções da Sportingbet enquanto aguarda.",
}

export default function SiteOfflinePage() {
  return (
    <>
      <SiteOffline />
    </>
  )
} 