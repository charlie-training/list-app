import { useEffect, useState } from 'react'
import './App.css'
import { getAllListItems } from './listDAO'
import { ApiGuard } from './ApiGuard'
import Login from './Login'
import ListItemRow, { AddRow } from './ListItem'
import refresh from "./assets/refresh.svg"

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
    <div style={{
      display: "flex",
      flexDirection: "column",
      padding: "1rem",
      maxWidth: "90vw",
      justifyItems: "center"
    }}>

      <ApiGuard>
        <h1 style={{ textAlign: "center", marginBottom: "1rem" }}>To-do List</h1>
        <div style={{ display: "flex", cursor: "pointer" }} onClick={() => setRefreshKey(refreshKey + 1)}>
          <img style={{
            width: "2rem",
            marginRight: "0",
            marginLeft: "auto",
            borderStyle: "solid",
            padding: "0.2rem",
            borderRadius: "0.5rem"
          }} src={refresh} />
        </div>
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
    </div>
  )
}

export default App
