interface ListItem {
    id: number,
    content: string,
    status: "complete" | "incomplete",
    tags: string[] | null
}

const baseApiUrl = "https://list-app-worker.cxlegge.workers.dev"

export async function createListItem(listItem: ListItem) {
    console.log(JSON.stringify(listItem))
    await fetch(baseApiUrl + "/create", {
        method: "POST",
        body: JSON.stringify(listItem)
    })
}

export async function getAllListItems() {
    return await fetch(baseApiUrl + "/all", {
        method: "GET",
    })
}