import { StrictMode } from "react"

import { createRoot } from "react-dom/client"

import { BrowserRouter } from "react-router-dom"

import { ThemeProvider } from "./context/ThemeContext"

import { ToastProvider } from "./context/ToastContext"

import StyleManager from "./components/StyleManager"

import App from "./App"


/*
    Entry point.

    No CSS is imported here — StyleManager injects the exact
    per-area stylesheet set the original pages used (see
    components/StyleManager.jsx). Fonts + Font Awesome are
    loaded once from index.html.
*/

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <ThemeProvider>
                <ToastProvider>
                    <StyleManager />
                    <App />
                </ToastProvider>
            </ThemeProvider>
        </BrowserRouter>
    </StrictMode>
)
