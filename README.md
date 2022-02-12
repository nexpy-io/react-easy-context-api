# @nexpy/react-easy-context-api

[![npm](https://img.shields.io/npm/v/@nexpy/react-easy-context-api)](https://www.npmjs.com/package/@nexpy/react-easy-context-api)
[![size](https://img.shields.io/bundlephobia/minzip/@nexpy/react-easy-context-api)](https://bundlephobia.com/result?p=@nexpy/react-easy-context-api)

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
yarn add @nexpy/react-easy-context-api scheduler
```

Notes for library authors:

Please do not forget to keep `"peerDependencies"` and
note instructions to let users to install peer dependencies.

## Technical memo

To make it work like original React context, it uses
[useReducer cheat mode](https://overreacted.io/a-complete-guide-to-useeffect/#why-usereducer-is-the-cheat-mode-of-hooks) intentionally.
It also requires `useContextUpdate` to behave better in Concurrent Mode.
(You don't need to use it in Legacy Mode.)

<br />

## Usage

```tsx
// cats-context.tsx
import { useState, FC } from 'react'

import { createContext } from '@nexpy/react-easy-context-api'

type MyContext = {
  pettedCats: number
  currentCats: number
}

const CatsContext = createContext<MyContext>({
  pettedCats: 0,
  currentCats: 0,
})

const CatsProvider: FC = ({ children }) => {
  const [pettedCats, setPettedCats] = useState(0)
  const [currentCats, setCurrentCats] = useState(0)

  // ... your context logic :)

  return (
    <CatsContext.Provider
      value={{
        pettedCats,
        currentCats,
      }}
    >
      {children}
    </CatsContext.Provider>
  )
}

export { CatsContext, CatsProvider }

// ... in your components
const CatsPetted = () => {
  const catsPettedNumber = CatsContext.useSelector(state => state.pettedCats)

  return <p>Petted cats: {catsPettedNumber}</p>
}

const CurrentCats = () => {
  const currentCatsNumber = CatsContext.useSelector(state => state.currentCats)

  return <p>Current cats: {currentCatsNumber}</p>
}

const App = () => (
  <CatsProvider>
    <CatsPetted />
    <CurrentCats />
  </CatsProvider>
)
```

---

## API

<br />

### **`createContext`**

This creates a special context.

#### Parameters

- `defaultValue`: **Value**

#### Examples

```ts
import { createContext } from '@nexpy/react-easy-context-api'

type PersonContext = {
  firstName: string
  familyName: string
}

const PersonContext = createContext<PersonContext>({ firstName: '', familyName: '' })
```

<br />

### **createContext Returns:**

<br />

#### `useSelector`

This hook returns context selected value by selector.

It will trigger re-render if only the selected value is referentially changed.

The selector should return referentially equal result for same input for better performance.

##### Parameters

- `selector`: **function (value: Value): Selected**

##### Examples

```tsx
const MyComponent = () => {
  const firstName = PersonContext.useSelector(state => state.firstName)

  return <p>{firstName}</p>
}
```

<br />

#### `useContext`

This hook returns the entire context value.
Use this instead of React.useContext for consistent behavior.

##### Examples

```tsx
const MyComponent = () => {
  const person = PersonContext.useContext()
  // ...
}
```

<br />

#### `useContextUpdate`

This hook returns an update function that accepts a thunk function.

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

<br />

#### `Provider`

The provider you need to use to apply the context.

---

<br />

### **Exotic Returns:**

You probably won't need the following features. Use only if you know what you are doing.

<br />

#### `Context`

The special context created by createContext hook. This context should not be consumed by the ro react `useContext` API, but by `useSpecialContext` bellow.

<br />

#### `useSpecialContext`

This Hook is used to manually consume the same special context `Context` created by `createContext` function. This is not necessary as there is a level of abstraction on top of that and this hook should only be used with contexts created by the library. This utility is only available so there are no limitations on the use of this library.

<br />

#### `useBridgeValue`

This hook return a value for BridgeProvider.

<br />

#### `BridgeProvider`

This is a Provider component for bridging multiple react roots.

##### Parameters

- `$0` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)**
  - `$0.context`
  - `$0.value`
  - `$0.children`

##### Examples

```tsx
import { createContext } from '@nexpy/react-easy-context-api'

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

---

## Limitations

- In order to stop propagation, `children` of a context provider has to be either created outside of the provider or memoized with `React.memo`.
- Provider trigger re-renders only if the context value is referentially changed.
- Neither context consumers or class components are supported.
- The [stale props](https://react-redux.js.org/api/hooks#stale-props-and-zombie-children) issue can't be solved in userland.
- Tearing is only avoided if all consumers get data using `useSelector`. If you use both props and selector to pass the same data, they may provide inconsistence data for a brief moment.

## Examples

[See this example file](https://github.com/nexpy-io/react-easy-context-api/blob/main/examples/cats.md).
