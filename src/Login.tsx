import { useState } from "react"

export default function Login() {
    const [apiKey, setApiKey] = useState("")
    return (
        <>
            <label htmlFor="apikey">Enter API Key: </label>
            <input id="apikey" value={apiKey} onChange={(event) => setApiKey(event.currentTarget.value)} />
            <button onClick={() => {
                window.localStorage.setItem("listappkey", apiKey)
                window.location.reload()
            }}
                style={{ marginLeft: "10px" }}> Submit </button>
        </>
    )
}