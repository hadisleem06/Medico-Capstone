import { useState } from "react"

import { useNavigate } from "react-router-dom"


/*
    Register — the "Create Account" auth page (route "/register").

    Originally a faithful port of pages/auth/register.html, which
    linked a register.js / register.css that never existed — so the
    page had no behaviour and was essentially unstyled (its
    register-* / login-link classes were styled nowhere). Per an
    explicit design request this page is now built to MATCH the
    login page: it reuses login.css's already-styled primitives —
    the same ones the login and forgot-password pages use
    (.login-container, .login-card, .login-btn, .register) — so the
    glass card, aurora background, inputs, gradient button and
    footer link render identically to login. The only
    register-specific chrome is the role picker, styled by the
    .role-selection / .role-option rules added to login.css.

    Show/hide password now works on BOTH password fields: each owns
    a boolean in state that flips its <input type> between
    "password" and "text" while swapping the fa-eye / fa-eye-slash
    icon. The login page's single toggle is wired identically. (In
    the original neither page loaded a script, so every eye icon was
    dead.)

    The text fields stay uncontrolled — the toggles only read/flip
    the input type, they don't own the value — matching the
    original's plain-input approach. Submit still preventDefault()s
    and goes nowhere: real registration belongs on the src/api
    service seam, not here, and wasn't part of this change.
*/

export default function Register() {

    const navigate = useNavigate()

    const [showPassword, setShowPassword] = useState(false)

    const [showConfirm, setShowConfirm] = useState(false)


    function handleSubmit(e) {
        // No register.js ever existed; the original form did nothing
        // meaningful on submit. Keep that behaviour, minus the reload.
        // (Real registration would attach to the src/api seam here.)
        e.preventDefault()
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
                        Create Account
                    </h1>


                    <p>
                        Join Medico and experience intelligent healthcare.
                    </p>


                    <form
                        id="registerForm"
                        noValidate
                        onSubmit={handleSubmit}
                    >

                        <div className="field">
                            <div className="input-box">

                                <i className="fa-solid fa-user"></i>

                                <input
                                    type="text"
                                    id="name"
                                    placeholder="Full Name"
                                />

                            </div>
                        </div>


                        <div className="field">
                            <div className="input-box">

                                <i className="fa-solid fa-envelope"></i>

                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Email Address"
                                />

                            </div>
                        </div>


                        <div className="field">
                            <div className="input-box">

                                <i className="fa-solid fa-phone"></i>

                                <input
                                    type="text"
                                    id="phone"
                                    placeholder="Phone Number"
                                />

                            </div>
                        </div>


                        <div className="field">
                            <div className="input-box">

                                <i className="fa-solid fa-lock"></i>

                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    placeholder="Password"
                                />

                                <i
                                    className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"} toggle-password`}
                                    role="button"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    title={showPassword ? "Hide password" : "Show password"}
                                    onClick={() => setShowPassword(v => !v)}
                                ></i>

                            </div>
                        </div>


                        <div className="field">
                            <div className="input-box">

                                <i className="fa-solid fa-lock"></i>

                                <input
                                    type={showConfirm ? "text" : "password"}
                                    id="confirmPassword"
                                    placeholder="Confirm Password"
                                />

                                <i
                                    className={`fa-solid ${showConfirm ? "fa-eye-slash" : "fa-eye"} toggle-password`}
                                    role="button"
                                    aria-label={showConfirm ? "Hide password" : "Show password"}
                                    title={showConfirm ? "Hide password" : "Show password"}
                                    onClick={() => setShowConfirm(v => !v)}
                                ></i>

                            </div>
                        </div>


                        <div className="role-selection">

                            <p>
                                I am a:
                            </p>


                            <div className="role-options">

                                <label className="role-option">

                                    <input
                                        type="radio"
                                        name="role"
                                        value="doctor"
                                        defaultChecked
                                    />

                                    <i className="fa-solid fa-user-doctor"></i>

                                    <span>
                                        Doctor
                                    </span>

                                </label>


                                <label className="role-option">

                                    <input
                                        type="radio"
                                        name="role"
                                        value="nurse"
                                    />

                                    <i className="fa-solid fa-user-nurse"></i>

                                    <span>
                                        Nurse
                                    </span>

                                </label>


                                <label className="role-option">

                                    <input
                                        type="radio"
                                        name="role"
                                        value="admin"
                                    />

                                    <i className="fa-solid fa-user-shield"></i>

                                    <span>
                                        Admin
                                    </span>

                                </label>

                            </div>

                        </div>


                        <button className="login-btn">

                            <span>
                                Create Account
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

                        Already have an account?

                        <a onClick={() => navigate("/login")}>
                            Login
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
