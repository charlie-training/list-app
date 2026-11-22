import {
  createListItem,
  deleteListItem,
  editListItemTags,
  editStatus,
  type ListItemDB,
} from "./listDAO";
import tick from "./assets/tick.svg";
import plus from "./assets/plus.svg";
import { useEffect, useRef, useState, type SetStateAction } from "react";
import Chip from "./Chip";
import { parseTags } from "./tags";

interface CheckBoxProps {
  item: ListItemDB;
  refreshKey: number;
  setRefreshKey: React.Dispatch<SetStateAction<number>>;
}
function CheckBox({ item, refreshKey, setRefreshKey }: CheckBoxProps) {
  const [checked, setChecked] = useState(item.status === "complete");

  useEffect(() => {
    setChecked(item.status === "complete");
  }, [item.status, refreshKey]);

  return (
    <div
      style={{
        borderRadius: "0.25rem",
        border: " solid white",
        width: "2rem",
        minWidth: "2rem",
        height: "2rem",
        display: "flex",
        marginRight: "1rem",
        cursor: "pointer",
      }}
      onClick={() => editStatus(item).then(() => setRefreshKey(refreshKey + 1))}
    >
      {checked ? <img src={tick} /> : null}
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditingTags, setIsEditingTags] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  const isLink = item.content.startsWith("https://");

  useEffect(() => {
    if (!menuOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (event.target instanceof Node && !actionsRef.current?.contains(event.target)) {
        closeMenu();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeMenu();
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
    setIsEditingTags(false);
    setActionError(null);
  }

  async function runMenuAction(action: () => Promise<unknown>, fallbackError: string) {
    try {
      await action();
      closeMenu();
      setRefreshKey((state) => state + 1);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : fallbackError);
    }
  }

  function handleDelete() {
    const itemId = item.id;
    if (itemId === undefined) {
      setActionError("This list item cannot be deleted because it has no ID.");
      return;
    }
    void runMenuAction(
      () => deleteListItem(itemId),
      "Failed to delete list item.",
    );
  }

  function handleSaveTags() {
    if (item.id === undefined) {
      setActionError("Tags cannot be updated because this list item has no ID.");
      return;
    }
    void runMenuAction(
      () => editListItemTags(item, parseTags(tagInput).join(",")),
      "Failed to update list item tags.",
    );
  }

  return (
    <div
      className="list-item-row"
      style={{
        border: "1px solid grey",
        padding: "2px",
      }}
    >
      <CheckBox
        item={item}
        refreshKey={refreshKey}
        setRefreshKey={setRefreshKey}
      />
      <div className="list-item-content">
        <p
          className="list-item-note"
          style={{
            fontSize: "1.2rem",
            textDecoration:
              item.status === "complete" ? "line-through 3px" : "none",
            color: item.status === "complete" ? "grey" : "white",
            textDecorationLine: isLink ? "underline" : "unset",
            cursor: isLink ? "pointer" : "unset",
          }}
          onClick={() => {
            if (isLink) window.open(item.content, "_blank");
          }}
        >
          {item.content}
        </p>
        <div className="list-item-tags">
          {parseTags(item.tag ?? "").map((tag) => (
            <Chip content={tag} key={tag} />
          ))}
        </div>
      </div>
      <div className="list-item-actions" ref={actionsRef}>
        <button
          type="button"
          className="list-item-menu-button"
          aria-label={`Actions for ${item.content}`}
          aria-expanded={menuOpen}
          onClick={() => {
            if (menuOpen) {
              closeMenu();
            } else {
              setActionError(null);
              setMenuOpen(true);
            }
          }}
        >
          <span aria-hidden="true">⋯</span>
        </button>
        {menuOpen && (
          <div className="list-item-menu" role="group" aria-label="List item actions">
            {isEditingTags ? (
              <form
                className="list-item-tag-editor"
                onSubmit={(event) => {
                  event.preventDefault();
                  handleSaveTags();
                }}
              >
                <label htmlFor={`tags-${item.id}`}>Tags</label>
                <input
                  id={`tags-${item.id}`}
                  name="tags"
                  value={tagInput}
                  placeholder="Tags (space or comma separated)"
                  onChange={(event) => setTagInput(event.currentTarget.value)}
                />
                <div className="list-item-menu-actions">
                  <button type="submit">Save</button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingTags(false);
                      setActionError(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setTagInput(item.tag ?? "");
                    setIsEditingTags(true);
                    setActionError(null);
                  }}
                >
                  Edit tags
                </button>
                <button type="button" onClick={handleDelete}>
                  Delete
                </button>
              </>
            )}
            {actionError && <p className="list-item-action-error" role="alert">{actionError}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

interface AddRowProps {
  noteToAdd: string;
  setNoteToAdd: (s: string) => void;
  tagToAdd: string;
  setTagToAdd: (s: string) => void;
  refreshKey: number;
  setRefreshKey: (n: number) => void;
  selectedTag: string | null;
}

export function AddRow({
  noteToAdd,
  setNoteToAdd,
  tagToAdd,
  setTagToAdd,
  refreshKey,
  setRefreshKey,
  selectedTag
}: AddRowProps) {
  const tags = parseTags(tagToAdd);

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
            fontSize: "1.5rem",
          }}
          value={noteToAdd}
          onChange={(event) => setNoteToAdd(event.currentTarget.value)}
        />
        <input
          name="tagtoadd"
          placeholder="tags (space or comma separated)"
          style={{
            display: "flex",
            width: "14rem",
            backgroundColor: "grey",
            height: "2rem",
            borderRadius: "0.5rem",
            fontSize: "1.1rem",
          }}
          value={tagToAdd}
          onChange={(event) => setTagToAdd(event.currentTarget.value)}
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
            tag: tags.length > 0 ? tags.join(",") : selectedTag ?? undefined,
          }).then(() => {
            setRefreshKey(refreshKey + 1);
            setNoteToAdd("");
            setTagToAdd("");
          });
        }}
      >
        <img src={plus} />
      </div>
    </div>
  );
}
