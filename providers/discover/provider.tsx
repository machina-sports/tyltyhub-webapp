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
  return children
}

export default DiscoverProvider
