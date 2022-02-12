# Cats Example

```tsx
import React from 'react'
import ReactDOM from 'react-dom'
// cats-context.tsx
import { useState, FC, Dispatch, SetStateAction } from 'react'

import { createContext } from '@nexpy/react-easy-context-api'

type CatsContextType = {
  pettedCats: number
  currentCats: number
  setPettedCats: Dispatch<SetStateAction<number>>
  setCurrentCats: Dispatch<SetStateAction<number>>
}

const CatsContext = createContext<CatsContextType>({} as CatsContextType)

const CatsProvider: FC = ({ children }) => {
  const [pettedCats, setPettedCats] = useState(0)
  const [currentCats, setCurrentCats] = useState(0)

  // ... your context logic :)

  return (
    <CatsContext.Provider
      value={{
        pettedCats,
        currentCats,
        setPettedCats,
        setCurrentCats,
      }}
    >
      {children}
    </CatsContext.Provider>
  )
}

const CatsPetted = () => {
  const catsPettedNumber = CatsContext.useSelector(state => state.pettedCats)
  const setter = CatsContext.useSelector(state => state.setPettedCats)

  return (
    <div>
      <p>Petted cats: {catsPettedNumber}</p>
      <button onClick={() => setter(prevState => prevState + 1)}>Add one</button>
    </div>
  )
}

const CurrentCats = () => {
  const currentCatsNumber = CatsContext.useSelector(state => state.currentCats)
  const setter = CatsContext.useSelector(state => state.setCurrentCats)

  return (
    <div>
      <p>Current cats: {currentCatsNumber}</p>
      <button onClick={() => setter(prevState => prevState + 1)}>Add one</button>
    </div>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <CatsProvider>
      <CatsPetted />
      <CurrentCats />
    </CatsProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
```
