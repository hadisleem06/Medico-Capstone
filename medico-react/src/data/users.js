/*
    Seed users.

    The 6 rows below come verbatim from the admin Users table
    (pages/admin/users.html) — every display field that table
    showed (userId, initials, phone, joined date, last activity)
    is carried so the admin Users page renders byte-identical
    rows.

    A 7th row is added for the app's own admin persona (Hadi),
    who has no row in that table (and so no userId / display
    fields), purely so logging in as him can reach /admin.

    `findUserByEmail` backs the login flow: on a valid form the
    entered email is looked up here and the user is routed to
    their role's dashboard (see authService / Login page). It
    iterates every user, Hadi included.

    `adminSeedUsers` is the subset carrying a userId — the 6
    table rows, excluding Hadi — so the admin Users list seeds
    to exactly the 6 accounts the original table listed.
*/

export const users = [

    {
        id: "u-1",
        userId: "PT-1024",
        name: "Ahmad Mansour",
        initials: "AM",
        email: "ahmad@example.com",
        phone: "+961 70 000 000",
        role: "patient",
        status: "active",
        joined: "Aug 08, 2026",
        activity: "Today · 10:42 AM",
    },

    {
        id: "u-2",
        userId: "DOC-204",
        name: "Dr. Lina Nassar",
        initials: "LN",
        email: "lina.nassar@example.com",
        phone: "+961 71 000 001",
        role: "doctor",
        status: "active",
        joined: "Jul 20, 2026",
        activity: "Today · 09:18 AM",
    },

    {
        id: "u-3",
        userId: "NUR-118",
        name: "Sarah Nehme",
        initials: "SN",
        email: "sarah.nehme@example.com",
        phone: "+961 76 000 002",
        role: "nurse",
        status: "active",
        joined: "Jul 15, 2026",
        activity: "Yesterday · 04:25 PM",
    },

    {
        id: "u-4",
        userId: "PT-1092",
        name: "Joseph Khoury",
        initials: "JK",
        email: "joseph.khoury@example.com",
        phone: "+961 70 000 003",
        role: "patient",
        status: "active",
        joined: "Jun 28, 2026",
        activity: "Today · 08:51 AM",
    },

    {
        id: "u-5",
        userId: "DOC-219",
        name: "Dr. Joseph Haddad",
        initials: "JH",
        email: "joseph.haddad@example.com",
        phone: "+961 71 000 004",
        role: "doctor",
        status: "pending",
        joined: "Aug 10, 2026",
        activity: "Pending verification",
    },

    {
        id: "u-6",
        userId: "PT-1101",
        name: "Rami Haddad",
        initials: "RH",
        email: "rami.haddad@example.com",
        phone: "+961 70 000 005",
        role: "patient",
        status: "inactive",
        joined: "May 18, 2026",
        activity: "Inactive account",
    },

    {
        id: "u-7",
        name: "Hadi",
        email: "hadi@example.com",
        role: "admin",
        status: "active",
    },

]


export const adminSeedUsers =
    users.filter(user => user.userId)


export function findUserByEmail(email) {

    const normalized =
        String(email || "").trim().toLowerCase()

    return (
        users.find(
            user => user.email.toLowerCase() === normalized
        ) || null
    )

}
