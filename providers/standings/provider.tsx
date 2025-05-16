"use client"

import { useEffect } from "react"
import { useAppDispatch } from "@/store/dispatch"
import { fetchStandings } from "./actions"

const StandingsProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchStandings())
  }, [dispatch])

  return children
}

export default StandingsProvider 