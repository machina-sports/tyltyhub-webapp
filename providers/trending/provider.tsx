"use client"

import { useEffect } from "react"

import { useAppDispatch } from "@/store/dispatch"

import { useGlobalState } from "@/store/useState"

import { getTrendingArticles } from "./actions"

const TrendingProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getTrendingArticles())
  }, [dispatch])

  return children
}

export default TrendingProvider
