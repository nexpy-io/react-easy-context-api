# react-easy-context-api

[![npm](https://img.shields.io/npm/v/react-easy-context-api)](https://www.npmjs.com/package/react-easy-context-api)
[![size](https://img.shields.io/bundlephobia/minzip/react-easy-context-api)](https://bundlephobia.com/result?p=react-easy-context-api)

## Introduction

Many times when using the React Context API we create unnecessary repetitive and extensive code.

And, React Context and useContext is often used to avoid prop drilling,
however it's known that there's a performance issue.
When a context value is changed, all components that useContext
will re-render.

To solve this issue,
[useContextSelector](https://github.com/reactjs/rfcs/pull/119)
is proposed and later proposed
[Speculative Mode](https://github.com/reactjs/rfcs/pull/150)
with context selector support.
This library provides an easy way to build and use the Context API with these issues fixed.

This package is constructed above the [use-context-selector](https://github.com/dai-shi/use-context-selector).

## Install

This package requires some peer dependencies, which you need to install by yourself.

```bash
yarn add react-easy-context-api react scheduler
```

Notes for library authors:

Please do not forget to keep `"peerDependencies"` and
note instructions to let users to install peer dependencies.

## Technical memo

To make it work like original React context, it uses
[useReducer cheat mode](https://overreacted.io/a-complete-guide-to-useeffect/#why-usereducer-is-the-cheat-mode-of-hooks) intentionally.
It also requires `useContextUpdate` to behave better in Concurrent Mode.
(You don't need to use it in Legacy Mode.)

## Usage

```tsx
// cats-context.tsx
import { useState } from 'react'

import { createContext } from 'react-easy-context-api'

type MyContext = {
    pettedCats: number
    currentCats: number
}

const { useSelector, Provider } = createContext<MyContext>({
    pettedCats: 0
    currentCats: 0
})

const CatsProvider = ({ children }) => {
    const [pettedCats, setPettedCats] = useState(0)
    const [currentCats, setCurrentCats] = useState(0)

    // ... your context logic :)

    return (
        <Provider value={{
            pettedCats,
            currentCats
        }}>
            {children}
        </Provider>
    )
}

export {
    CatsProvider,
    useSelector
}

// ... in your components
const CatsPetted = () => {
    const catsPettedNumber = useSelector(state => state.pettedCats)

    return (
        <p>Petted cats: {catsPettedNumber}</p>
    )
}

const CurrentCats = () => {
    const currentCatsNumber = useSelector(state => state.currentCats)

    return (
        <p>Current cats: {currentCatsNumber}</p>
    )
}

const App = () => (
    <CatsProvider>
        <CatsPetted />
        <CurrentCats />
    </CatsProvider>
)
```

## API

### createContext

This creates a special context.

#### Parameters

- `defaultValue` **Value**

#### Examples

```ts
import { createContext } from 'react-easy-context-api'

type PersonContext = {
  firstName: string
  familyName: string
}

const PersonContext = createContext<PersonContext>({ firstName: '', familyName: '' })
```

### Returns:

#### useSelector

This hook returns context selected value by selector.

It will trigger re-render if only the selected value is referentially changed.

The selector should return referentially equal result for same input for better performance.

##### Parameters

- `selector` **function (value: Value): Selected**

##### Examples

```tsx
const MyComponent = () => {
  const firstName = PersonContext.useSelector(state => state.firstName)

  return <p>{firstName}</p>
}
```

#### useContext

This hook returns the entire context value.
Use this instead of React.useContext for consistent behavior.

##### Examples

```tsx
const MyComponent = () => {
  const person = PersonContext.useContext()
  // ...
}
```

#### useContextUpdate

This hook returns an update function that accepts a thunk function

Use this for a function that will change a value in
[Concurrent Mode](https://reactjs.org/docs/concurrent-mode-intro.html).
Otherwise, there's no need to use this hook.

##### Examples

```tsx
const MyComponent = () => {
    const update = PersonContext.useContextUpdate()

    update(() => setState(...));
    // ...
}
```

#### BridgeProvider

This is a Provider component for bridging multiple react roots

##### Parameters

- `$0` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)**
  - `$0.context`
  - `$0.value`
  - `$0.children`

##### Examples

```tsx
import { createContext } from 'react-easy-context-api'

type PersonContext = {
  firstName: string
  familyName: string
}

const { Context, useBridgeValue, BridgeProvider } = createContext<PersonContext>({
  firstName: '',
  familyName: '',
})

const App = () => {
  const valueToBridge = useBridgeValue()

  return (
    <>
      <BridgeProvider context={Context} value={valueToBridge}>
        {children}
      </BridgeProvider>
    </>
  )
}
```

#### useBridgeValue

This hook return a value for BridgeProvider

## Limitations

- In order to stop propagation, `children` of a context provider has to be either created outside of the provider or memoized with `React.memo`.
- Provider trigger re-renders only if the context value is referentially changed.
- Neither context consumers or class components are supported.
- The [stale props](https://react-redux.js.org/api/hooks#stale-props-and-zombie-children) issue can't be solved in userland.
- Tearing is only avoided if all consumers get data using `useSelector`. If you use both props and selector to pass the same data, they may provide inconsistence data for a brief moment.

## Examples

Usage examples are being built.
