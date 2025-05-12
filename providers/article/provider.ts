"use client"

import { useEffect } from "react"

import { useAppDispatch } from "@/store/dispatch"

import { useGlobalState } from "@/store/useState"

import * as actions from "@/providers/article/actions"

const ArticleProvider = ({
  children,
  articleId,
}: {
  children: React.ReactNode,
  articleId?: string
}) => {

  const dispatch = useAppDispatch()
  const articleState = useGlobalState((state: any) => state.article)

  useEffect(() => {
    if (articleId) {
      dispatch(actions.doFetchArticle(articleId))
    }
  }, [dispatch, articleId])

  useEffect(() => {
    const article = articleState.currentArticle
    if (article) {
      if (article.metadata) {
        const { event_type, competition, language } = article.metadata
        dispatch(actions.doFetchRelatedArticles({ eventType: event_type, competition, language }))
      }
      if (article._id) {
        dispatch(actions.doIncrementArticleViews(article._id))
      }
    }
  }, [dispatch, articleState.currentArticle])

  return children
}

export default ArticleProvider
