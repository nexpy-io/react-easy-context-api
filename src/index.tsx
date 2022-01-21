import { PropsWithChildren } from 'react'

import {
  createContext as createContextWithSelector,
  useContextSelector,
  useContext as useSpecialContext,
  useContextUpdate as useSpecialContextUpdate,
  useBridgeValue as useSpecialBridgeValue,
  BridgeProvider,
} from './contextSelector'

type ProviderProps<Value> = PropsWithChildren<{
  value: Value
}>

/**
 * This creates a special context.
 *
 * @param defaultValue Value
 *
 * @example
 * import { createContext } from 'react-easy-context-api'
 *
 * type PersonContext = {
 *   firstName: string
 *   familyName: string
 * }
 *
 * const PersonContext = createContext<PersonContext>({ firstName: '', familyName: '' })
 */
const createContext = <Value,>(defaultValue: Value) => {
  /**
   * The special context created by createContext hook.
   */
  const Context = createContextWithSelector(defaultValue)

  /**
   * This hook returns context selected value by selector.
   * It will trigger re-render if only the selected value is referentially changed.
   * The selector should return referentially equal result for same input for better performance.
   *
   * @param selector function (value: Value): Selected
   *
   * @example
   * const MyComponent = () => {
   *  const firstName = PersonContext.useSelector(state => state.firstName)
   *
   *  return <p>{firstName}</p>
   * }
   */
  const useSelector = <Selected,>(selector: (state: Value) => Selected) =>
    useContextSelector(Context, selector)

  /**
   * This hook returns the entire context value.
   * Use this instead of React.useContext for consistent behavior.
   *
   * @example
   * const MyComponent = () => {
   * const person = PersonContext.useContext()
   *  ...
   * }
   */
  const useContext = () => useSpecialContext(Context)

  /**
   * This hook returns an update function that accepts a thunk function.
   *
   * Use this for a function that will change a value in
   * [Concurrent Mode](https://reactjs.org/docs/concurrent-mode-intro.html).
   * Otherwise, there's no need to use this hook.
   *
   * @example
   * const MyComponent = () => {
   *   const update = PersonContext.useContextUpdate()
   *
   *   update(() => setState(...));
   *   ...
   * }
   */
  const useContextUpdate = () => useSpecialContextUpdate(Context)

  /**
   * This hook return a value for BridgeProvider.
   */
  const useBridgeValue = () => useSpecialBridgeValue(Context)

  /**
   * The provider you need to use to apply the context.
   */
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
