import { useState } from 'react'
import './App.css'
import { createListItem } from './listDAO'

function App() {
  const [count, setCount] = useState(0)
  const [listItems,] = useState([])

  return (
    <>
      <h1>Charlie + Beth</h1>
      <div className='allNotes'>
        {listItems.map((item) => <span> {item} </span>)}
      </div>
      <div className="card">
        <button onClick={() => {
          createListItem({ id: count, content: "from local", status: "incomplete", tags: null })
          setCount((prev) => prev + 1)
        }}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
