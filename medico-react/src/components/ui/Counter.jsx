import { useCountUp } from "../../hooks/useCountUp"


/*
    Counter — animated number.

    Wraps useCountUp (rAF, 900ms cubic ease-out) and renders the
    element given by `as` (default <span>) with the given
    className, matching whichever tag the original counter used
    (doctor used <span class="doctor-counter">, nurse / admin
    used <h2 class="nurse-counter"> / <h2 class="admin-counter">).
    Any suffix ("+", "%") is rendered by the page next to it.
*/

export default function Counter({ target, className, as: Tag = "span", ...rest }) {

    const value = useCountUp(target)

    return (
        <Tag className={className} {...rest}>
            {value}
        </Tag>
    )

}
