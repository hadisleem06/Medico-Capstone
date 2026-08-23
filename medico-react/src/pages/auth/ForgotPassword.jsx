import { useNavigate } from "react-router-dom"


/*
    ForgotPassword — shell stub (route "/forgot-password").

    The original pages/auth/forgot-password.html is an empty
    (0-byte) file: the login page's "Forgot password?" link pointed
    at href="#" and this page was never authored. The route exists
    for completeness (parity with the original file tree + the fact
    that login now links here). Rather than a blank page it renders
    a minimal, on-brand card reusing the auth chrome — StyleManager
    serves login.css for /forgot-password, so the background,
    nav, card and security note are styled exactly like the login
    page. If a real reset flow is added later, it attaches here.
*/

export default function ForgotPassword() {

    const navigate = useNavigate()


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
                        Reset Password
                    </h1>


                    <p>
                        This feature is coming soon.
                    </p>


                    <p className="register">

                        Remember your password?

                        <a onClick={() => navigate("/login")}>
                            Back to login
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
