import { useRef, useState } from "react"

import { useNavigate } from "react-router-dom"

import { useRole } from "../../context/RoleContext"

import { useAccount } from "../../context/AccountContext"

import { useClickOutside } from "../../hooks/useClickOutside"


/*
    ProfileMenu — the topbar profile trigger + dropdown.

    Reproduces the two distinct original skins exactly:

      variant "doctor"  (doctor pages)
        .profile:  img + .profile-info(strong + span) + .profile-arrow
        menu item: <i/> + <span>label</span>

      variant "simple"  (nurse / admin pages)
        .profile:  img + <span>name</span> + plain chevron
        menu item: <i/> + " label "  (bare text)

    The identity comes from AccountContext (not ROLES directly),
    so editing your name / photo on the My Profile page updates
    this menu live.

    Behaviour matches global.js: clicking the profile toggles
    ".profile-menu.show"; clicking outside the container closes
    it; the logout item routes to /login. Items that carry a
    `page` (My Profile / Settings) now route to that role page —
    the rest stay inert as they were in the original.
*/

function assetUrl(path) {

    if (path.startsWith("http") || path.startsWith("data:")) {
        return path
    }

    return (
        import.meta.env.BASE_URL +
        path.replace(/^\//, "")
    )

}


export default function ProfileMenu() {

    const role = useRole()

    const { profile } = useAccount()

    const [open, setOpen] = useState(false)

    const containerRef = useRef(null)

    const navigate = useNavigate()


    useClickOutside(
        containerRef,
        () => setOpen(false),
        open
    )


    const isDoctor = profile.variant === "doctor"

    const avatar = assetUrl(profile.avatar)


    const onItemClick = (item) => {

        if (item.logout) {
            setOpen(false)
            navigate("/login")
            return
        }

        if (item.page) {
            setOpen(false)
            navigate(`/${role}/${item.page}`)
        }

    }


    return (
        <div className="profile-container" ref={containerRef}>

            <div
                className="profile"
                onClick={() => setOpen(value => !value)}
            >

                <img src={avatar} alt="Profile" />

                {isDoctor ? (
                    <div className="profile-info">
                        <strong>{profile.name}</strong>
                        <span>{profile.sub}</span>
                    </div>
                ) : (
                    <span>{profile.name}</span>
                )}

                <i
                    className={
                        "fa-solid fa-chevron-down" +
                        (isDoctor ? " profile-arrow" : "")
                    }
                ></i>

            </div>


            <div className={"profile-menu" + (open ? " show" : "")}>

                <div className="profile-header">

                    <img src={avatar} alt="Profile" />

                    <div>
                        <h4>{profile.header.name}</h4>
                        <p>{profile.header.sub}</p>
                    </div>

                </div>

                <hr />

                {profile.menu.map(item => (
                    <div
                        key={item.label}
                        className={"menu-item" + (item.logout ? " logout-item" : "")}
                        onClick={() => onItemClick(item)}
                    >
                        <i className={"fa-solid " + item.icon}></i>
                        {isDoctor
                            ? <span>{item.label}</span>
                            : <>{" "}{item.label}{" "}</>}
                    </div>
                ))}

            </div>

        </div>
    )

}
