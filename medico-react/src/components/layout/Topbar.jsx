import { useRole } from "../../context/RoleContext"

import { ROLES } from "../../data/roles"

import ProfileMenu from "./ProfileMenu"


/*
    Topbar — rendered by each page as the first child of
    .main-content (matching the original, where the topbar
    was hand-authored at the top of every page's main area).

    Three original variants, chosen by role config:

      "doctor" -> <header class="topbar"> + .doctor-breadcrumb
      "page"   -> <nav class="topbar">    + .page-title > .page-breadcrumb
      "plain"  -> <nav class="topbar">    + .page-title > h2 only
                  (patient pages had no breadcrumb line)

    Props:
      title   - the page <h2> text
      status  - show the doctor "Available" pill (dashboard only)
      actions - optional nodes rendered before the profile menu
*/

export default function Topbar({ title, status = false, actions = null }) {

    const role = useRole()

    const config = ROLES[role]


    if (config.topbar === "doctor") {

        return (
            <header className="topbar">

                <div>

                    <div className="doctor-breadcrumb">
                        <span>MEDICO</span>
                        <i className="fa-solid fa-chevron-right"></i>
                        {" "}{config.workspace}
                    </div>

                    <h2>{title}</h2>

                </div>


                <div className="top-actions">

                    {status && (
                        <div className="doctor-status">
                            <span className="status-dot"></span>
                            {" "}Available
                        </div>
                    )}

                    {actions}

                    <ProfileMenu />

                </div>

            </header>
        )

    }


    return (
        <nav className="topbar">

            <div className="page-title">

                {config.topbar === "page" && (
                    <div className="page-breadcrumb">
                        <span>MEDICO</span>
                        <i className="fa-solid fa-chevron-right"></i>
                        {" "}{config.workspace}
                    </div>
                )}

                <h2>{title}</h2>

            </div>


            <div className="top-actions">

                {actions}

                <ProfileMenu />

            </div>

        </nav>
    )

}
