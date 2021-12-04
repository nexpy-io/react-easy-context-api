import { PropsWithChildren } from 'react'

import {
  createContext as createContextWithSelector,
  useContextSelector,
  useContext as useSpecialContext,
  useContextUpdate as useSpecialContextUpdate,
  useBridgeValue as useSpecialBridgeValue,
} from 'use-context-selector'

type ProviderProps<Value> = PropsWithChildren<{
  value: Value
}>

const createContext = <Value,>(initialValue: Value) => {
  const Context = createContextWithSelector(initialValue)

  const useSelector = <Selected,>(selector: (state: Value) => Selected) =>
    useContextSelector(Context, selector)

  const useContext = () => useSpecialContext(Context)

  const useContextUpdate = () => useSpecialContextUpdate(Context)

  const useBridgeValue = () => useSpecialBridgeValue(Context)

  const Provider = ({ children, value }: ProviderProps<Value>) => (
    <Context.Provider value={value}>{children}</Context.Provider>
  )

  return {
    Context,
    useSelector,
    useContext,
    useContextUpdate,
    useBridgeValue,
    Provider,
  }
}

export { createContext }
