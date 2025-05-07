import { AppState } from "@/store"

import { useSelector, TypedUseSelectorHook } from "react-redux"

export const useGlobalState: TypedUseSelectorHook<AppState> = useSelector