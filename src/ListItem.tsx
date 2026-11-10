import {
  createListItem,
  deleteListItem,
  editStatus,
  type ListItemDB,
} from "./listDAO";
import tick from "./assets/tick.svg";
import plus from "./assets/plus.svg";
import bin from "./assets/bin.svg";
import { useMemo, useState, type SetStateAction } from "react";
import Chip from "./Chip";

interface CheckBoxProps {
  item: ListItemDB;
  refreshKey: number;
  setRefreshKey: React.Dispatch<SetStateAction<number>>;
}
function CheckBox({ item, refreshKey, setRefreshKey }: CheckBoxProps) {
  const [checked, setChecked] = useState(item.status == "complete");

  useMemo(() => {
    setChecked(item.status == "complete");
  }, [refreshKey]);

  return (
    <div
      style={{
        borderStyle: "solid",
        borderColor: "white",
        borderRadius: "0.25rem",
        width: "2rem",
        minWidth: "2rem",
        height: "2rem",
        display: "flex",
        marginRight: "1rem",
      }}
      onClick={() => editStatus(item).then(() => setRefreshKey(refreshKey + 1))}
    >
      {checked ? <img src={tick} /> : null}
    </div>
  );
}

interface DeleteIconProps {
  itemId?: number;
  refreshKey: number;
  setRefreshKey: React.Dispatch<SetStateAction<number>>;
}

function DeleteIcon({ itemId, setRefreshKey }: DeleteIconProps) {
  return (
    <div
      style={{
        borderStyle: "solid",
        borderColor: "red",
        borderRadius: "0.25rem",
        width: "2rem",
        height: "2rem",
        display: "flex",
        marginRight: "1rem",
        backgroundColor: "red",
      }}
      onClick={() => {
        if (itemId)
          deleteListItem(itemId).then(() =>
            setRefreshKey((state) => state + 1),
          );
      }}
    >
      <img src={bin} />
    </div>
  );
}

interface ListItemProps {
  item: ListItemDB;
  refreshKey: number;
  setRefreshKey: React.Dispatch<SetStateAction<number>>;
}

export default function ListItemRow({
  item,
  refreshKey,
  setRefreshKey,
}: ListItemProps) {
  const [contentStatus, setContentStatus] = useState({
    content: item.content,
    status: item.status,
    tag: item.tag
  });

  const isLink = contentStatus.content.startsWith("https://")

  useMemo(() => {
    setContentStatus({ content: item.content, status: item.status, tag: item.tag });
  }, [refreshKey]);

  return (
    <>
      <div
        key={item.id}
        style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
      >
        <DeleteIcon
          itemId={item.id}
          refreshKey={refreshKey}
          setRefreshKey={setRefreshKey}
        />

        <CheckBox
          item={item}
          refreshKey={refreshKey}
          setRefreshKey={setRefreshKey}
        />
        <p
          style={{
            fontSize: "1.2rem",
            textDecoration:
              contentStatus.status === "complete" ? "line-through 3px" : "none",
            color: item.status === "complete" ? "grey" : "white",
            textDecorationLine: isLink ? "underline" : "unset"
          }}
          onClick={() => {
            if (isLink) window.open(contentStatus.content, "_blank")
          }}
        >
          {contentStatus.content}
        </p>

      </div>
      {contentStatus.tag && (
        <Chip content={contentStatus.tag} />
      )}
    </>
  );
}

interface AddRowProps {
  noteToAdd: string;
  setNoteToAdd: (s: string) => void;
  tagToAdd: string;
  setTagToAdd: (s: string) => void;
  refreshKey: number;
  setRefreshKey: (n: number) => void;
}

export function AddRow({
  noteToAdd,
  setNoteToAdd,
  tagToAdd,
  setTagToAdd,
  refreshKey,
  setRefreshKey,
}: AddRowProps) {
  return (
    <div
      style={{ display: "flex", paddingTop: "0.9rem", paddingLeft: "3.35rem" }}
    >
      <div>
        <input
          name="notetoadd"
          placeholder="note"
          style={{
            display: "flex",
            width: "14rem",
            backgroundColor: "grey",
            height: "2rem",
            borderRadius: "0.5rem",
            fontSize: "1.5rem"
          }}
          value={noteToAdd}
          onChange={(event) => {
            setNoteToAdd(event.currentTarget.value);
          }}
        />
        <input
          name="tagtoadd"
          placeholder="tag (optional)"
          style={{
            display: "flex",
            width: "14rem",
            backgroundColor: "grey",
            height: "2rem",
            borderRadius: "0.5rem",
            fontSize: "1.5rem",
          }}
          value={tagToAdd}
          onChange={(event) => {
            setTagToAdd(event.currentTarget.value);
          }}
        />
      </div>
      <div
        style={{
          borderStyle: "solid",
          borderColor: "white",
          borderRadius: "0.25rem",
          width: "2rem",
          height: "2rem",
          display: "flex",
          marginLeft: "1rem",
          cursor: "pointer",
        }}
        onClick={() => {
          createListItem({
            content: noteToAdd,
            status: "incomplete",
            tag: tagToAdd.length > 0 ? tagToAdd : undefined,
          }).then(() => {
            setRefreshKey(refreshKey + 1);
            setNoteToAdd("");
            setTagToAdd("")
          });
        }}
      >

        <img src={plus} />
      </div>
    </div>
  );
}
