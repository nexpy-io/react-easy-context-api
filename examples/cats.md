```tsx
import React from 'react'
import ReactDOM from 'react-dom'
// cats-context.tsx
import { useState, FC, Dispatch, SetStateAction } from 'react'

import { createContext } from '@nexpy/react-easy-context-api'

type MyContext = {
  pettedCats: number
  currentCats: number
  setPettedCats: Dispatch<SetStateAction<number>>
  setCurrentCats: Dispatch<SetStateAction<number>>
}

const { useSelector, Provider } = createContext<MyContext>({} as MyContext)

const CatsProvider: FC = ({ children }) => {
  const [pettedCats, setPettedCats] = useState(0)
  const [currentCats, setCurrentCats] = useState(0)

  // ... your context logic :)

  return (
    <Provider
      value={{
        pettedCats,
        currentCats,
        setPettedCats,
        setCurrentCats,
      }}
    >
      {children}
    </Provider>
  )
}

const CatsPetted = () => {
  const catsPettedNumber = useSelector(state => state.pettedCats)
  const setter = useSelector(state => state.setPettedCats)

  return (
    <div>
      <p>Petted cats: {catsPettedNumber}</p>
      <button onClick={() => setter(prevState => prevState + 1)}>Add one</button>
    </div>
  )
}

const CurrentCats = () => {
  const currentCatsNumber = useSelector(state => state.currentCats)
  const setter = useSelector(state => state.setCurrentCats)

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
