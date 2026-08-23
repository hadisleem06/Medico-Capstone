/*
    Tiny HTTP client — the backend/AI integration seam.

    Reads the API base URL from the environment
    (import.meta.env.VITE_API_BASE_URL, documented in
    .env.example). It is intentionally unused by the mock
    service bodies today: services resolve from src/data so
    the UX is identical to the static original.

    When the backend + AI services are ready, each service
    method swaps its mock body for a call to this client —
    no UI/component changes required.
*/

const BASE_URL =
    import.meta.env.VITE_API_BASE_URL || ""


async function request(path, options = {}) {

    const response = await fetch(
        `${BASE_URL}${path}`,
        {
            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {}),
            },
            ...options,
        }
    )

    if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`)
    }

    return response.json()

}


export const client = {

    baseUrl: BASE_URL,

    get: (path) =>
        request(path),

    post: (path, body) =>
        request(path, {
            method: "POST",
            body: JSON.stringify(body),
        }),

    put: (path, body) =>
        request(path, {
            method: "PUT",
            body: JSON.stringify(body),
        }),

    del: (path) =>
        request(path, {
            method: "DELETE",
        }),

}
