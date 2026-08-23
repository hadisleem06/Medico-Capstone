import { useEffect, useRef, useState } from "react"


/*
    Animated count-up.

    Faithful port of the counter animation in
    global.js: 900ms duration with a cubic ease-out
    (1 - (1 - t)^3), counting from 0 to `target`.

    In the original the selector omitted ".doctor-counter"
    (and patient pages never loaded global.js) so those
    counters never animated. Driving every counter through
    this hook fixes that while keeping the exact easing.
*/

export function useCountUp(target, duration = 900) {

    const [value, setValue] = useState(0)

    const frame = useRef(0)


    useEffect(() => {

        const end = Number(target)

        if (Number.isNaN(end) || end < 0) {
            setValue(target)
            return
        }


        let startTime = null


        const update = (now) => {

            if (startTime === null) {
                startTime = now
            }

            const elapsed = now - startTime

            const progress = Math.min(elapsed / duration, 1)

            const eased = 1 - Math.pow(1 - progress, 3)

            setValue(Math.floor(eased * end))


            if (progress < 1) {
                frame.current = requestAnimationFrame(update)
            } else {
                setValue(end)
            }

        }


        frame.current = requestAnimationFrame(update)

        return () => cancelAnimationFrame(frame.current)

    }, [target, duration])


    return value

}
