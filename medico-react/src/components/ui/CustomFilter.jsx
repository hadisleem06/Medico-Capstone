import { useRef, useState } from "react"

import { useClickOutside } from "../../hooks/useClickOutside"


/*
    CustomFilter — the nurse pages' plain-text dropdown.

    Reproduces the original `.custom-filter` menus in
    assets/js/nurse.js (the waiting-room status filter, the
    patients gender filter and the vitals patient selector): a
    trigger showing the current selection over a menu of
    plain-text `.filter-option` buttons — no per-option icon,
    unlike the doctor / admin FilterDropdown (`.admin-filter`).

      .custom-filter {className} (+ .open while the menu is shown)
        > .filter-trigger > span(selected label) + chevron
        > .filter-menu
            > .filter-option (+ .active on the selected value)

    Controlled: the parent owns `value` and receives onChange(value).
    useClickOutside closes the menu when a click lands elsewhere,
    matching nurse.js's document-level "click outside closes".

      options: [{ value, label }]
*/

export default function CustomFilter({ id, className, options, value, onChange }) {

    const [open, setOpen] = useState(false)

    const ref = useRef(null)


    useClickOutside(
        ref,
        () => setOpen(false),
        open
    )


    const selected =
        options.find(option => option.value === value) ||
        options[0]


    return (

        <div
            className={
                "custom-filter" +
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
                    {selected.label}
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
                        {option.label}
                    </button>

                ))}

            </div>

        </div>

    )

}
