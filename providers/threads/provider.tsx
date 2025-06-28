"use client"

import { actionSearch } from "@/providers/threads/actions"

import { clear } from "@/providers/threads/reducer"

import { useAppDispatch } from "@/store/dispatch"

import { useGlobalState } from "@/store/useState"

import React, { useEffect } from "react"


const ThreadsProvider = ({ children }: { children: React.ReactNode }) => {

  const state = useGlobalState((state: any) => state.threads)

  // const stateUser = useGlobalState((state: any) => state.userprofile)

  // const user_id = stateUser.userProfile.data

  const user_id = "123"

  const dispatch = useAppDispatch()

  useEffect(() => {

    if (user_id) {

      dispatch(actionSearch({
        filters: {
          name: 'thread',
          "metadata.user_id": user_id
        },
        pagination: state.list.pagination,
        sorters: state.list.sorters,
      }))
    }

    return () => {
      dispatch(clear())
    }
  }, [user_id])

  return <>{children}</>
}

export default ThreadsProvider