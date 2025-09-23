import { useEffect, useState } from 'react'
import './App.css'
import { createListItem, getAllListItems } from './listDAO'
import { ApiGuard } from './ApiGuard'
import Login from './Login'
import ListItemRow, { AddRow } from './ListItem'

function App() {
  const [count, setCount] = useState(0)
  const [listItems, setListItems] = useState([])
  const [noteToAdd, setNoteToAdd] = useState("")

  useEffect(() => {
    async function getAllFromDb() {
      setListItems(await getAllListItems())
    }
    getAllFromDb()
  }, [])

  const apiKey = window.localStorage.getItem("listappkey");

  if (!apiKey) return <Login />

  return (
    <>
      <ApiGuard>
        <h1>To-do List</h1>
        <div className='allNotes'>
          {listItems.map((item) => <ListItemRow item={item} />)}
          <AddRow noteToAdd={noteToAdd} setNoteToAdd={setNoteToAdd} />
        </div>
        <div className="card">
          <button onClick={async () => {
            createListItem({ content: noteToAdd, status: "incomplete", tag: undefined })
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
      </ApiGuard>
    </>
  )
}

export default App
