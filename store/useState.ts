import { useSelector, TypedUseSelectorHook } from 'react-redux'
import type { RootState } from '.'

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const useGlobalState = () => {
  const articles = useAppSelector((state) => state.articles)
  
  return {
    articles
  }
} 