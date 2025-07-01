"use client"

import { useEffect } from "react"

import { useAppDispatch } from "@/store/dispatch"

import { useGlobalState } from "@/store/useState"

import {fetchCalendar} from './actions';

const CalendarProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const dispatch = useAppDispatch()
  const { data, filters, pagination, sorters } = useGlobalState((state: any) => state.calendar);
  useEffect(() => {
    dispatch(fetchCalendar({ filters, pagination, sorters }))
  }, [dispatch])

  return children
}

export default CalendarProvider 