import { useState } from "react"

import { useNavigate } from "react-router-dom"


/*
    Login — the "Welcome Back" auth page (route "/login").

    A faithful port of pages/auth/login.html + assets/js/login.js.
    The markup mirrors the original (animated blob background,
    "Back Home" nav, glass login-card, email / password fields,
    remember-me + forgot-password row, divider, register link,
    security note). Styling comes from login.css, injected by
    StyleManager for /login (the original never loaded global.css,
    so this page renders bare, outside AppLayout).

    Validation is reproduced exactly from login.js:
      - both values are trimmed
      - email: required, then must match the same regex
      - password: required, then min 6 characters
      - the identical messages, in the identical order
    Errors render as a ".error-message" div appended inside the
    field (matching where login.js inserted it) and the offending
    input gets the ".error" class.

    The original login.js ended a valid submit with
    alert("Login successful") and went nowhere — a dead end in a
    single-page app. Per the migration decision we keep every bit
    of that validation but, on success, navigate into the app
    instead. The landing target is intentionally a single constant
    below so it is a one-line change.

    Show/hide password: login.js never wired the fa-eye
    "toggle-password" icon (the page loaded no script that did), so
    in the original it was dead. It now works — clicking it flips
    the password input between "password" and "text" and swaps the
    icon to fa-eye-slash. The register page's toggles are wired the
    same way.
*/

const SUCCESS_ROUTE = "/doctor/dashboard"


function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}


export default function Login() {

    const navigate = useNavigate()

    const [email, setEmail] = useState("")

    const [password, setPassword] = useState("")

    const [showPassword, setShowPassword] = useState(false)

    const [errors, setErrors] = useState({})


    function handleSubmit(e) {

        e.preventDefault()


        const nextErrors = {}

        const trimmedEmail = email.trim()

        const trimmedPassword = password.trim()


        // EMAIL CHECK

        if (trimmedEmail === "") {
            nextErrors.email = "Email is required"
        }
        else if (!isValidEmail(trimmedEmail)) {
            nextErrors.email = "Please enter a valid email address"
        }


        // PASSWORD CHECK

        if (trimmedPassword === "") {
            nextErrors.password = "Password is required"
        }
        else if (trimmedPassword.length < 6) {
            nextErrors.password = "Password must be at least 6 characters"
        }


        setErrors(nextErrors)


        if (Object.keys(nextErrors).length === 0) {
            navigate(SUCCESS_ROUTE)
        }

    }


    return (
        <>

            {/* Animated Background */}

            <div className="background">

                <div className="blob blob-one"></div>
                <div className="blob blob-two"></div>
                <div className="blob blob-three"></div>


                <div className="medical-icons">

                    <span>🧬</span>
                    <span>⚕️</span>
                    <span>🩺</span>
                    <span>🧫</span>
                    <span>💊</span>
                    <span>🧠</span>
                    <span>❤️</span>

                </div>

            </div>


            <nav>

                <div className="logo">
                    🩺 Medico
                </div>


                <a onClick={() => navigate("/")}>

                    <i className="fa-solid fa-arrow-left"></i>

                    Back Home

                </a>

            </nav>


            <main className="login-container">

                <div className="login-card">

                    <div className="brand">
                        <span>
                            AI POWERED HEALTHCARE
                        </span>
                    </div>


                    <h1>
                        Welcome Back
                    </h1>


                    <p>
                        Continue your AI-powered healthcare journey.
                    </p>


                    <form
                        id="loginForm"
                        noValidate
                        onSubmit={handleSubmit}
                    >

                        <div className="field">

                            <div className="input-box">

                                <i className="fa-solid fa-envelope"></i>

                                <input
                                    type="text"
                                    id="email"
                                    placeholder="Email Address"
                                    className={errors.email ? "error" : undefined}
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />

                            </div>

                            {errors.email && (
                                <div className="error-message">
                                    {errors.email}
                                </div>
                            )}

                        </div>


                        <div className="field">

                            <div className="input-box">

                                <i className="fa-solid fa-lock"></i>

                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    placeholder="Password"
                                    className={errors.password ? "error" : undefined}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />

                                <i
                                    className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"} toggle-password`}
                                    role="button"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    title={showPassword ? "Hide password" : "Show password"}
                                    onClick={() => setShowPassword(v => !v)}
                                ></i>

                            </div>

                            {errors.password && (
                                <div className="error-message">
                                    {errors.password}
                                </div>
                            )}

                        </div>


                        <div className="options">

                            <label>

                                <input type="checkbox" />

                                Remember me

                            </label>


                            <a onClick={() => navigate("/forgot-password")}>
                                Forgot password?
                            </a>

                        </div>


                        <button className="login-btn">

                            <span>
                                Login
                            </span>

                            <i className="fa-solid fa-arrow-right"></i>

                        </button>

                    </form>


                    <div className="divider">
                        <span>
                            OR
                        </span>
                    </div>


                    <p className="register">

                        Don't have an account?

                        <a onClick={() => navigate("/register")}>
                            Create Account
                        </a>

                    </p>


                    <div className="security">

                        <i className="fa-solid fa-shield-halved"></i>

                        Protected by AI Security

                    </div>

                </div>

            </main>

        </>
    )

}
