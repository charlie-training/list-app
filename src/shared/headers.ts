export const listAppHeaders = (key: string) => {
    return new Headers({
        "List-App-Key": key
    })
}