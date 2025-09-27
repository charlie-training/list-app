export default function Unauthorised() {
    return (
        <div>
            <p> Access Forbidden, please refresh the page and enter the correct API key </p>
            <button onClick={() => {
                window.localStorage.removeItem("listappkey")
                window.location.reload()
            }}> Reload Page </button>
        </div>
    )
}