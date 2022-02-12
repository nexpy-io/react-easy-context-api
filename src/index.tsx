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
 * import { createContext } from '@nexpy/react-easy-context-api'
 *
 * type PersonContext = {
 *   firstName: string
 *   familyName: string
 * }
 *
 * const PersonContext = createContext<PersonContext>({ firstName: '', familyName: '' })
 */
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
    /**
     * This Hook is used to manually consume the same special context
     * `Context` created by `createContext` function. This is not necessary
     * as there is a level of abstraction on top of that and this hook should
     * only be used with contexts created by the library. This utility is only
     * available so there are no limitations on the use of this library.
     */
    useSpecialContext,

    /**
     * The special context created by createContext hook.
     */
    Context,

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
    useSelector,

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
    useContext,

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
    useContextUpdate,

    /**
     * This hook return a value for BridgeProvider.
     */
    useBridgeValue,

    /**
     * The provider you need to use to apply the context.
     */
    Provider,

    /**
     * This is a Provider component for bridging multiple react roots
     *
     * @example
     * const valueToBridge = useBridgeValue(PersonContext);
     * return (
     *   <Renderer>
     *     <BridgeProvider context={Context} value={valueToBridge}>
     *       {children}
     *     </BridgeProvider>
     *   </Renderer>
     * );
     */
    BridgeProvider,
  }
}

export { createContext }
