import { useRef, useState } from "react"

import { useClickOutside } from "../../hooks/useClickOutside"


/*
    FilterDropdown — the app's custom select.

    Reproduces the original `.admin-filter` dropdown used by the
    appointment filters and the admin filters (initAppointmentFilters
    / initAdminDropdown): a trigger button showing the current
    selection, and a menu of `.filter-option` buttons.

      .admin-filter (+ .open when the menu is showing)
        > .filter-trigger > span(selected label) + chevron
        > .filter-menu
            > .filter-option (+ .active on the selected value)

    Controlled: the parent owns `value` and gets `onChange(value)`.
    Opening one dropdown closes any other, because clicking its
    trigger is an "outside click" for the others (useClickOutside),
    matching the original "only one open at a time" behaviour.

    Props:
      options      : [{ value, label, icon? }] — icon is optional;
                     the admin toolbar / log filters have none, so
                     their options render as plain labels.
      className    : extra class on the root (admin modal dropdowns
                     add "admin-modal-dropdown").
      fallbackLabel: label shown when `value` matches no option — the
                     admin edit form uses it so a "pending" account
                     shows "Pending" though the menu lists only
                     Active / Inactive (as the original did). Without
                     it the first option's label is the fallback.
*/

export default function FilterDropdown({ id, options, value, onChange, className, fallbackLabel }) {

    const [open, setOpen] = useState(false)

    const ref = useRef(null)


    useClickOutside(
        ref,
        () => setOpen(false),
        open
    )


    const selected =
        options.find(option => option.value === value)


    const label =
        selected
            ? selected.label
            : fallbackLabel !== undefined
                ? fallbackLabel
                : options[0]
                    ? options[0].label
                    : ""


    return (

        <div
            className={
                "admin-filter" +
                (className ? " " + className : "") +
                (open ? " open" : "")
            }
            id={id}
            ref={ref}
        >

            <button
                type="button"
                className="filter-trigger"
                onClick={() => setOpen(current => !current)}
            >

                <span>
                    {label}
                </span>

                <i className="fa-solid fa-chevron-down"></i>

            </button>


            <div className="filter-menu">

                {options.map(option => (

                    <button
                        key={option.value}
                        type="button"
                        className={
                            "filter-option" +
                            (option.value === value ? " active" : "")
                        }
                        onClick={() => {

                            onChange(option.value)

                            setOpen(false)

                        }}
                    >

                        {option.icon && (
                            <i className={"fa-solid " + option.icon}></i>
                        )}

                        <span>
                            {option.label}
                        </span>

                    </button>

                ))}

            </div>

        </div>

    )

}
