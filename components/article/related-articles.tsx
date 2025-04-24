import { Card } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from 'date-fns/locale'
import Image from "next/image"
import Link from "next/link"
import discoverData from "@/data/discover.json"

interface RelatedArticlesProps {
  currentArticleId: string
}

export function RelatedArticles({ currentArticleId }: RelatedArticlesProps) {
  const articles = discoverData.articles
    .filter(article => article.id !== currentArticleId)
    .slice(0, 4)

  return (
    <div className="space-y-6 w-full overflow-hidden">
      <h3 className="text-lg font-semibold">Artigos Relacionados</h3>
      <div className="flex overflow-x-auto pb-6 -mx-4 px-4 space-x-4 snap-x scroll-smooth">
        {articles.map((article) => (
          <Card key={article.id} className="overflow-hidden flex-none first:ml-0 last:mr-4 min-w-[280px] max-w-[280px]">
            <Link href={`/discover/${article.id}`}>
              <div className="relative aspect-video w-full snap-start">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 280px, 33vw"
                />
              </div>
              <div className="p-4 w-full">
                <h4 className="font-semibold line-clamp-2 mb-2 text-base">{article.title}</h4>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-muted" />
                  {formatDistanceToNow(new Date(article.date), { addSuffix: true, locale: ptBR })}
                </p>
              </div>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  )
}