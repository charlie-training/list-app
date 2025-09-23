import type { ListItem } from "./listDAO";
import tick from "./assets/tick.svg"
import plus from "./assets/plus.svg"

interface CheckBoxProps {
    status: string
}
function CheckBox({ status }: CheckBoxProps) {

    return (
        <div style={{ borderStyle: "solid", borderColor: "white", borderRadius: "0.25rem", width: "2rem", height: "2rem", display: "flex", marginRight: "1rem" }}
            onClick={() => alert()}>
            {status === "complete" ? <img src={tick} /> : null} </div>
    )
}

interface ListItemProps {
    item: ListItem
}

export default function ListItemRow({ item }: ListItemProps) {

    return (<div key={item.id} style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
        <CheckBox status={item.status} />
        <p style={{ fontSize: "1.2rem" }}> {item.content} </p>
    </div>)
}

interface AddRowProps {
    noteToAdd: string,
    setNoteToAdd: (s: string) => void
}

export function AddRow({ noteToAdd, setNoteToAdd }: AddRowProps) {
    return (
        <div style={{ display: "flex", alignItems: "center", paddingTop: "0.9rem" }}>
            <div style={{ borderStyle: "solid", borderColor: "white", borderRadius: "0.25rem", width: "2rem", height: "2rem", display: "flex", marginRight: "1rem" }}
                onClick={() => alert("Adding note!")}>
                <img src={plus} />
            </div>
            <input style={{ width: "10rem", backgroundColor: "grey", height: "2rem", borderRadius: "0.5rem", fontSize: "1.5rem" }} value={noteToAdd} onChange={(event) => {
                setNoteToAdd(event.currentTarget.value)
            }} />
        </div>
    )
}