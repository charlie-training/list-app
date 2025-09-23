import { useEffect, useState } from "react";
import { baseApiUrl } from "./listDAO";
import Unauthorised from "./Unauthorised";
import { listAppHeaders } from "./shared/headers";

interface ApiGuardProps {
    children: React.ReactNode[]
}

export function ApiGuard({ children }: ApiGuardProps) {
    const [authorised, setAuthorised] = useState(false)

    const apiKey = window.localStorage.getItem("listappkey") ?? "";

    useEffect(() => {
        async function validateKey() {
            const authResponse = await fetch(baseApiUrl + "/auth", { method: "POST", body: apiKey, headers: listAppHeaders(apiKey) })
            console.log(authResponse)
            if (authResponse.status === 200) {
                setAuthorised(true)
            } else {
                setAuthorised(false)
            }
        }
        validateKey()
    }, [])

    if (!authorised) {
        return <Unauthorised />
    }

    return <>{children}</>
}   