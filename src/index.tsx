import { PropsWithChildren } from 'react'

import {
  createContext as createContextWithSelector,
  useContextSelector,
  useContext as useSpecialContext,
  useContextUpdate as useSpecialContextUpdate,
  useBridgeValue as useSpecialBridgeValue,
  BridgeProvider,
} from 'use-context-selector'

type ProviderProps<Value> = PropsWithChildren<{
  value: Value
}>

const createContext = <Value,>(defaultValue: Value) => {
  const Context = createContextWithSelector(defaultValue)

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
    BridgeProvider,
  }
}

export { createContext }
