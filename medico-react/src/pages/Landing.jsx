import { useNavigate } from "react-router-dom"

import DnaScene from "../components/DnaScene"


/*
    Landing — the public marketing page (route "/").

    A faithful port of the original pages/auth/index.html: aurora
    backdrop, navbar, split hero (copy + 3D DNA), a trust-stats
    band, a five-card features grid and a marquee footer. Styling
    comes entirely from landing.css (injected by StyleManager for
    "/"); this page never loaded global.css, so it renders bare
    (outside AppLayout) exactly like the original standalone file.

    The original lived under pages/auth/ but its links were written
    as if it sat at the repo root ("pages/auth/login.html", a
    root-relative "main.js", etc.), so every internal link was in
    fact broken. Here they become clean router navigations:
      - navbar "Login" button      -> /login
      - hero "Get Started"         -> /register
      - footer "Login"             -> /login
    The purely decorative nav / footer anchors (Features, AI
    Assistant, Doctors) were href="#" placeholders and stay inert.

    The hero <h1> is plain text split by a <br/> (no inline
    <span>), so the JSX hero-space fix does not apply here.

    The <script type="module" src="main.js"> Three.js scene is
    replaced by the <DnaScene/> component, which renders the same
    #scene div and drives the identical animation.
*/

export default function Landing() {

    const navigate = useNavigate()


    return (
        <>

            {/* ================= AURORA BACKGROUND ================= */}

            <div className="aurora">
                <div className="aurora-1"></div>
                <div className="aurora-2"></div>
                <div className="aurora-3"></div>
            </div>


            {/* ================= NAVBAR ================= */}

            <nav>

                <div className="logo">
                    🩺 Medico
                </div>


                <div className="links">

                    <a href="#">
                        Features
                    </a>

                    <a href="#">
                        AI Assistant
                    </a>

                    <a href="#">
                        Doctors
                    </a>

                </div>


                <button
                    className="login-btn"
                    onClick={() => navigate("/login")}
                >
                    Login
                </button>

            </nav>


            {/* ================= HERO ================= */}

            <section className="hero">

                {/* LEFT CONTENT */}

                <div className="content">

                    <span>
                        AI POWERED HEALTHCARE
                    </span>


                    <h1 className="gradient-text">
                        The Future Of
                        <br />
                        Personal Healthcare
                    </h1>


                    <p>
                        AI-powered healthcare platform
                        connecting patients, doctors,
                        and medical intelligence.
                    </p>


                    <div className="buttons">

                        <a
                            className="shimmer-btn"
                            onClick={() => navigate("/register")}
                        >
                            Get Started

                            <i className="fa-solid fa-arrow-right"></i>
                        </a>

                    </div>

                </div>


                {/* RIGHT 3D AREA */}

                <div className="visual">

                    {/* DNA MODEL */}

                    <DnaScene />


                    {/* AI PLATFORM */}

                    <div className="dna-platform">
                    </div>

                </div>

            </section>


            <div className="section-divider"></div>


            {/* ================= TRUST STATS ================= */}

            <section className="stats-section">

                <div className="section-title">

                    <span>
                        MEDICO TRUST
                    </span>

                    <h2>
                        Numbers That Define Our Technology
                    </h2>

                    <p>
                        Connecting patients, doctors and artificial intelligence
                        through smarter healthcare.
                    </p>

                </div>


                <div className="stats-grid">

                    <div className="stat-card">

                        <h2>
                            50K+
                        </h2>

                        <p>
                            Patients Connected
                        </p>

                    </div>


                    <div className="stat-card">

                        <h2>
                            500+
                        </h2>

                        <p>
                            Medical Specialists
                        </p>

                    </div>


                    <div className="stat-card">

                        <h2>
                            98%
                        </h2>

                        <p>
                            AI Accuracy
                        </p>

                    </div>


                    <div className="stat-card">

                        <h2>
                            24/7
                        </h2>

                        <p>
                            Healthcare Support
                        </p>

                    </div>

                </div>

            </section>


            <div className="section-divider"></div>


            {/* ================= FEATURES ================= */}

            <section className="features-section">

                <div className="section-title">

                    <span>
                        MEDICO INTELLIGENCE
                    </span>

                    <h2>
                        Healthcare Powered By AI
                    </h2>

                    <p>
                        Advanced artificial intelligence designed to understand,
                        analyze and improve your healthcare experience.
                    </p>

                </div>


                <div className="features-grid">

                    <div className="feature-card feature-main">

                        <div className="icon">
                            🧠
                        </div>

                        <h3>
                            AI Medical Assistant
                        </h3>

                        <p>
                            Your intelligent health companion that provides
                            smart medical guidance anytime.
                        </p>

                    </div>


                    <div className="feature-card">

                        <div className="icon">
                            🧬
                        </div>

                        <h3>
                            Health Analysis
                        </h3>

                        <p>
                            AI analyzes your health data and discovers useful insights.
                        </p>

                    </div>


                    <div className="feature-card">

                        <div className="icon">
                            📄
                        </div>

                        <h3>
                            Digital Records
                        </h3>

                        <p>
                            Securely manage your medical history in one place.
                        </p>

                    </div>


                    <div className="feature-card">

                        <div className="icon">
                            🧪
                        </div>

                        <h3>
                            Lab Intelligence
                        </h3>

                        <p>
                            Transform complex reports into understandable information.
                        </p>

                    </div>


                    <div className="feature-card">

                        <div className="icon">
                            👨‍⚕️
                        </div>

                        <h3>
                            Doctor Network
                        </h3>

                        <p>
                            Connect with trusted healthcare professionals.
                        </p>

                    </div>

                </div>

            </section>


            {/* ================= FOOTER ================= */}

            <footer>

                <div className="marquee">

                    <div className="marquee-track">

                        <span>🧬 AI Diagnostics</span>
                        <span>🩺 Smart Healthcare</span>
                        <span>🧠 AI Medical Assistant</span>
                        <span>📄 Medical Reports</span>
                        <span>🔒 Secure Health Data</span>
                        <span>👨‍⚕️ Doctor Connect</span>
                        <span>❤️ Personalized Care</span>

                        {/* duplicate for infinite effect */}

                        <span>🧬 AI Diagnostics</span>
                        <span>🩺 Smart Healthcare</span>
                        <span>🧠 AI Medical Assistant</span>
                        <span>📄 Medical Reports</span>
                        <span>🔒 Secure Health Data</span>
                        <span>👨‍⚕️ Doctor Connect</span>
                        <span>❤️ Personalized Care</span>

                    </div>

                </div>


                <div className="footer-content">

                    <div className="footer-logo">

                        🩺 Medico

                        <p>
                            The future of personal healthcare.
                        </p>

                    </div>


                    <div className="footer-links">

                        <a href="#">Features</a>

                        <a href="#">AI Assistant</a>

                        <a href="#">Doctors</a>

                        <a onClick={() => navigate("/login")}>Login</a>

                    </div>

                </div>

            </footer>

        </>
    )

}
