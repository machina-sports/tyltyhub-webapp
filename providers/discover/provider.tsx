"use client"

import { useEffect } from "react"

import { useAppDispatch } from "@/store/dispatch"

import { useGlobalState } from "@/store/useState"

import * as actions from "@/providers/discover/actions"

const DiscoveryProvider = ({
  children,

}: {
  children: React.ReactNode,
}) => {

  const dispatch = useAppDispatch()

  const discoveryState = useGlobalState((state: any) => state.discover)

  useEffect(() => {
    dispatch(actions.doSearchArticles({
      filters: discoveryState.articles.filters,
      pagination: discoveryState.articles.pagination,
      sorters: [discoveryState.articles.sorters.field, discoveryState.articles.sorters.order]
    }))
  }, [
    dispatch,
    discoveryState.articles.filters,
    discoveryState.articles.pagination,
    discoveryState.articles.sorters
  ])

  return children
}

export default DiscoveryProvider
