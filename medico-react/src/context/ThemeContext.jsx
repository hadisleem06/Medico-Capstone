import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react"


/*
    Theme (dark / light).

    Single source of truth for the ".light-mode" body class,
    persisted under localStorage["theme"] exactly like global.js.
    ( The old ".light-theme" doctor variant is dead and is not
      carried over. )
*/

const ThemeContext = createContext(null)


export function ThemeProvider({ children }) {

    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("theme") === "light"
            ? "light"
            : "dark"
    })


    useEffect(() => {

        document.body.classList.toggle(
            "light-mode",
            theme === "light"
        )

        localStorage.setItem("theme", theme)

    }, [theme])


    const toggleTheme = () => {
        setTheme(prev => (prev === "light" ? "dark" : "light"))
    }


    const value = {
        theme,
        isLight: theme === "light",
        toggleTheme,
    }


    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )

}


export function useTheme() {

    const ctx = useContext(ThemeContext)

    if (!ctx) {
        throw new Error("useTheme must be used within a ThemeProvider")
    }

    return ctx

}
