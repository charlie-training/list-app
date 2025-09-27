import { createListItem, deleteListItem, editStatus, type ListItem } from "./listDAO";
import tick from "./assets/tick.svg"
import plus from "./assets/plus.svg"
import bin from "./assets/bin.svg"
import { useMemo, useState } from "react";

interface CheckBoxProps {
    item: ListItem,
    refreshKey: number,
    setRefreshKey: (n: number) => void
}
function CheckBox({ item, refreshKey, setRefreshKey }: CheckBoxProps) {
    const [checked, setChecked] = useState(item.status == "complete")

    useMemo(() => {
        setChecked(item.status == "complete")
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

interface DeleteIconProps {
    itemId?: number
    refreshKey: number,
    setRefreshKey: (n: number) => void
}

function DeleteIcon({ itemId, refreshKey, setRefreshKey }: DeleteIconProps) {
    return (
        <div style={{
            borderStyle: "solid",
            borderColor: "red",
            borderRadius: "0.25rem",
            width: "2rem",
            height: "2rem",
            display: "flex",
            marginRight: "1rem",
            backgroundColor: "red"
        }}
            onClick={() => {
                if (itemId) deleteListItem(itemId).then(() => setRefreshKey(refreshKey + 1))
            }}>
            <img src={bin} />
        </div>
    )
}

interface ListItemProps {
    item: ListItem
    refreshKey: number,
    setRefreshKey: (n: number) => void
}

export default function ListItemRow({ item, refreshKey, setRefreshKey }: ListItemProps) {
    const [contentStatus, setContentStatus] = useState({ content: item.content, status: item.status })

    useMemo(() => {
        console.log("Fetching listItemRow...");

        setContentStatus({ content: item.content, status: item.status })
    }, [refreshKey])

    return (<div key={item.id} style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
        <DeleteIcon
            itemId={item.id}
            refreshKey={refreshKey}
            setRefreshKey={setRefreshKey} />

        <CheckBox item={item} refreshKey={refreshKey} setRefreshKey={setRefreshKey} />
        <p style={{
            fontSize: "1.2rem",
            textDecoration: contentStatus.status === "complete" ? "line-through 3px" : "none",
            color: item.status === "complete" ? "grey" : "white"
        }}> {contentStatus.content} </p>
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
        <div style={{ display: "flex", alignItems: "center", paddingTop: "0.9rem", paddingLeft: "3.35rem" }}>

            <input
                name="notetoadd"
                style={{
                    width: "15rem",
                    backgroundColor: "grey",
                    height: "2rem",
                    borderRadius: "0.5rem",
                    fontSize: "1.5rem"
                }}
                value={noteToAdd}
                onChange={(event) => {
                    setNoteToAdd(event.currentTarget.value)
                }} />
            <div style={{
                borderStyle: "solid",
                borderColor: "white",
                borderRadius: "0.25rem",
                width: "2rem",
                height: "2rem",
                display: "flex",
                marginLeft: "1rem",
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
        </div >
    )
}