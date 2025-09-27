import { useEffect, useState } from 'react'
import './App.css'
import { getAllListItems } from './listDAO'
import { ApiGuard } from './ApiGuard'
import Login from './Login'
import ListItemRow, { AddRow } from './ListItem'

function App() {
  const [listItems, setListItems] = useState([])
  const [noteToAdd, setNoteToAdd] = useState("")
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    async function getAllFromDb() {
      setListItems(await getAllListItems())
    }
    getAllFromDb()
  }, [refreshKey])

  const apiKey = window.localStorage.getItem("listappkey");

  if (!apiKey) return <Login />

  return (
    <>
      <ApiGuard>
        <h1>To-do List</h1>
        <div className='allNotes'>
          {listItems.map((item, index) => <ListItemRow
            key={index}
            item={item}
            refreshKey={refreshKey}
            setRefreshKey={setRefreshKey}
          />)}
          <AddRow
            noteToAdd={noteToAdd}
            setNoteToAdd={setNoteToAdd}
            refreshKey={refreshKey}
            setRefreshKey={setRefreshKey} />
        </div>
      </ApiGuard>
    </>
  )
}

export default App
