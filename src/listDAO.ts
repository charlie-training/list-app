export interface ListItem {
    id?: number,
    content: string,
    status: "complete" | "incomplete",
    tag?: string
}

export const baseApiUrl = "https://list-app-worker.cxlegge.workers.dev"

function switchStatus(status: string) {
    if (status == "incomplete") { return "complete" }
    return "incomplete"

}

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

export async function editStatus(item: ListItem) {
    const apiKey = window.localStorage.getItem("listappkey") ?? "";
    const response = await fetch(`${baseApiUrl}/edit/${item.id}`, {
        method: "PUT",
        headers: {
            "List-App-Key": apiKey
        },
        body: JSON.stringify(Object.assign(item, { status: switchStatus(item.status) }))
    })

    return (await response.json())
}

export async function deleteListItem(id: number) {
    const apiKey = window.localStorage.getItem("listappkey") ?? "";
    const response = await fetch(`${baseApiUrl}/delete/${id}`, {
        method: "DELETE",
        headers: {
            "List-App-Key": apiKey
        },
    })

    return (await response.json())
}