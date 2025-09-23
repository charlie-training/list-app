export interface ListItem {
    id?: number,
    content: string,
    status: "complete" | "incomplete",
    tag?: string
}

export const baseApiUrl = "https://list-app-worker.cxlegge.workers.dev"

export async function createListItem(listItem: ListItem) {
    const apiKey = window.localStorage.getItem("listappkey") ?? "";
    console.log(JSON.stringify(listItem))
    await fetch(baseApiUrl + "/create", {
        method: "POST",
        body: JSON.stringify(listItem),
        headers: {
            "List-App-Key": apiKey
        }
    })
}

export async function getAllListItems() {
    const apiKey = window.localStorage.getItem("listappkey") ?? "";
    const response = await fetch(baseApiUrl + "/all", {
        method: "GET",
        headers: {
            "List-App-Key": apiKey
        }
    })

    return (await response.json())
}

export async function editListItem(id: number) {
    const apiKey = window.localStorage.getItem("listappkey") ?? "";
    const response = await fetch(`${baseApiUrl}/edit/${id}`, {
        method: "PUT",
        headers: {
            "List-App-Key": apiKey
        }
    })

    return (await response.json())
}