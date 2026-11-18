import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { getAllListItems, type ListItemDB } from "./listDAO";
import { ApiGuard } from "./ApiGuard";
import Login from "./Login";
import ListItemRow, { AddRow } from "./ListItem";
import refresh from "./assets/refresh.svg";
import { parseTags } from "./tags";

function App() {
  const [listItems, setListItems] = useState<ListItemDB[]>([]);
  const [noteToAdd, setNoteToAdd] = useState("");
  const [tagToAdd, setTagToAdd] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    async function getAllFromDb() {
      setListItems(await getAllListItems());
    }
    getAllFromDb();
  }, [refreshKey]);

  const tags = useMemo(
    () => [...new Set(listItems.flatMap((item) => parseTags(item.tag ?? "")))].sort(),
    [listItems],
  );
  const filteredItems = selectedTag
    ? listItems.filter((item) => parseTags(item.tag ?? "").includes(selectedTag))
    : listItems;

  const apiKey = window.localStorage.getItem("listappkey");

  if (!apiKey) return <Login />;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "1rem",
        maxWidth: "90vw",
        justifyItems: "center",
      }}
    >
      <ApiGuard>
        <h1 style={{ textAlign: "center", marginBottom: "1rem" }}>
          To-do List
        </h1>
        <div className="list-toolbar">
          <div className="tag-filters" aria-label="Filter by tag">
            <button
              type="button"
              className={selectedTag === null ? "tag-filter selected" : "tag-filter"}
              aria-pressed={selectedTag === null}
              onClick={() => setSelectedTag(null)}
            >
              All
            </button>
            {tags.map((tag) => (
              <button
                type="button"
                className={selectedTag === tag ? "tag-filter selected" : "tag-filter"}
                aria-pressed={selectedTag === tag}
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              >
                {tag}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="refresh-button"
            aria-label="Refresh list"
            onClick={() => setRefreshKey((state) => state + 1)}
          >
            <img src={refresh} />
          </button>
        </div>
        <div className="allNotes">
          {filteredItems.map((item) => (
            <ListItemRow
              key={item.id}
              item={item}
              refreshKey={refreshKey}
              setRefreshKey={setRefreshKey}
            />
          ))}
          <AddRow
            noteToAdd={noteToAdd}
            setNoteToAdd={setNoteToAdd}
            tagToAdd={tagToAdd}
            setTagToAdd={setTagToAdd}
            refreshKey={refreshKey}
            setRefreshKey={setRefreshKey}
          />
        </div>
      </ApiGuard>
    </div>
  );
}

export default App;
