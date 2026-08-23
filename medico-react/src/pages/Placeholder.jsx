import Topbar from "../components/layout/Topbar"


/*
    Temporary placeholder used while pages are being ported
    phase by phase. Chrome pages render the real Topbar inside
    the layout so the sidebar / topbar / profile / theme /
    routing can be validated now; bare pages (auth / landing)
    render a simple standalone message.

    Replaced by the real page as each phase lands.
*/

export default function Placeholder({ title, status = false, bare = false }) {

    if (bare) {
        return (
            <div style={{ padding: "48px", maxWidth: "720px", margin: "0 auto" }}>
                <h1>{title}</h1>
                <p>Coming soon — React migration in progress.</p>
            </div>
        )
    }

    return (
        <>
            <Topbar title={title} status={status} />

            <section style={{ padding: "24px" }}>
                <p>{title} — page coming soon.</p>
            </section>
        </>
    )

}
