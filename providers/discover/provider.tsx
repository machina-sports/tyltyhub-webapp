"use client"

import { useEffect } from "react"

import { useAppDispatch } from "@/store/dispatch"

import { useGlobalState } from "@/store/useState"

import { searchArticles } from "./actions"

const DiscoverProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const dispatch = useAppDispatch()
  const discoverState = useGlobalState((state: any) => state.discover)

  useEffect(() => {
    dispatch(searchArticles({
      filters: {
        name: "content-article",
        "metadata.language": "br"
      },
      pagination: {
        page: 1,
        page_size: 10
      },
      sorters: ["_id", -1]
    }))
  }, [dispatch])

  return children
}

export default DiscoverProvider
