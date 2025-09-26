import { createListItem, editStatus, type ListItem } from "./listDAO";
import tick from "./assets/tick.svg"
import plus from "./assets/plus.svg"
import { useMemo, useState } from "react";

interface CheckBoxProps {
    item: ListItem
}
function CheckBox({ item }: CheckBoxProps) {
    const [refreshKey, setRefreshKey] = useState(1)

    let checked = false

    useMemo(() => {
        checked = item.status == "complete"
    }, [refreshKey])

    return (
        <div style={{
            borderStyle: "solid",
            borderColor: "white",
            borderRadius: "0.25rem",
            width: "2rem",
            height: "2rem",
            display: "flex",
            marginRight: "1rem"
        }}
            onClick={() => editStatus(item).then(() => setRefreshKey(refreshKey + 1))}>
            {checked ? <img src={tick} /> : null} </div>
    )
}

interface ListItemProps {
    item: ListItem
}

export default function ListItemRow({ item }: ListItemProps) {

    return (<div key={item.id} style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
        <CheckBox item={item} />
        <p style={{ fontSize: "1.2rem" }}> {item.content} </p>
    </div>)
}

interface AddRowProps {
    noteToAdd: string,
    setNoteToAdd: (s: string) => void
    refreshKey: number
    setRefreshKey: (n: number) => void
}

export function AddRow({ noteToAdd, setNoteToAdd, refreshKey, setRefreshKey }: AddRowProps) {
    return (
        <div style={{ display: "flex", alignItems: "center", paddingTop: "0.9rem" }}>
            <div style={{
                borderStyle: "solid",
                borderColor: "white",
                borderRadius: "0.25rem",
                width: "2rem",
                height: "2rem",
                display: "flex",
                marginRight: "1rem",
                cursor: "pointer"
            }}
                onClick={() => {
                    createListItem({ content: noteToAdd, status: "incomplete", tag: undefined })
                        .then(() => {
                            setRefreshKey(refreshKey + 1)
                            setNoteToAdd("")
                        })
                }
                }>
                <img src={plus} />
            </div>
            <input style={{
                width: "10rem",
                backgroundColor: "grey",
                height: "2rem",
                borderRadius: "0.5rem",
                fontSize: "1.5rem"
            }}
                value={noteToAdd}
                onChange={(event) => {
                    setNoteToAdd(event.currentTarget.value)
                }} />
        </div >
    )
}