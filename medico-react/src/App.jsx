import { Routes, Route, Navigate } from "react-router-dom"

import AppLayout from "./components/layout/AppLayout"

import Landing from "./pages/Landing"

import Login from "./pages/auth/Login"

import Register from "./pages/auth/Register"

import ForgotPassword from "./pages/auth/ForgotPassword"

import DoctorDashboard from "./pages/doctor/Dashboard"

import DoctorAppointments from "./pages/doctor/Appointments"

import DoctorConsultation from "./pages/doctor/Consultation"

import DoctorIcd10 from "./pages/doctor/Icd10"

import DoctorPatientProfile from "./pages/doctor/PatientProfile"

import DoctorSoap from "./pages/doctor/Soap"

import DoctorPatients from "./pages/doctor/Patients"

import DoctorInvestigation from "./pages/doctor/Investigation"

import DoctorLabAnalysis from "./pages/doctor/LabAnalysis"

import DoctorRadiologyAnalysis from "./pages/doctor/RadiologyAnalysis"

import DoctorMedicationAssistant from "./pages/doctor/MedicationAssistant"

import DoctorReports from "./pages/doctor/Reports"

import NurseDashboard from "./pages/nurse/Dashboard"

import NurseWaitingRoom from "./pages/nurse/WaitingRoom"

import NurseRegisterPatient from "./pages/nurse/RegisterPatient"

import NurseVitals from "./pages/nurse/Vitals"

import NursePatients from "./pages/nurse/Patients"

import AdminDashboard from "./pages/admin/Dashboard"

import AdminUsers from "./pages/admin/Users"

import AdminAuditLogs from "./pages/admin/AuditLogs"

import AccountProfile from "./pages/account/Profile"

import AccountSettings from "./pages/account/Settings"


/*
    Route table (React Router v6, nested layouts + <Outlet/>).

    Chrome areas (doctor / nurse / admin) render the
    shared AppLayout with the page in the Outlet. Standalone
    pages (landing / auth) render bare.

    All areas are ported: the doctor / nurse / admin
    chrome areas plus the standalone landing + auth pages
    (Landing, Login, Register, ForgotPassword).

    Each chrome area also mounts the shared account pages
    (My Profile / Settings) at /<role>/profile and
    /<role>/settings. These have no original-demo equivalent
    (the profile-menu items were inert) — one page component
    serves all three roles and reads the current role from
    context, so the chrome stays role-correct.
*/

export default function App() {

    return (
        <Routes>

            {/* Standalone / auth */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />


            {/* Doctor */}
            <Route path="/doctor" element={<AppLayout role="doctor" />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<DoctorDashboard />} />
                <Route path="appointments" element={<DoctorAppointments />} />
                <Route path="consultation" element={<DoctorConsultation />} />
                <Route path="patients" element={<DoctorPatients />} />
                <Route path="icd10" element={<DoctorIcd10 />} />
                <Route path="investigation" element={<DoctorInvestigation />} />
                <Route path="lab-analysis" element={<DoctorLabAnalysis />} />
                <Route path="radiology-analysis" element={<DoctorRadiologyAnalysis />} />
                <Route path="medication-assistant" element={<DoctorMedicationAssistant />} />
                <Route path="patient-profile" element={<DoctorPatientProfile />} />
                <Route path="reports" element={<DoctorReports />} />
                <Route path="soap" element={<DoctorSoap />} />
                <Route path="profile" element={<AccountProfile />} />
                <Route path="settings" element={<AccountSettings />} />
            </Route>


            {/* Nurse */}
            <Route path="/nurse" element={<AppLayout role="nurse" />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<NurseDashboard />} />
                <Route path="waiting-room" element={<NurseWaitingRoom />} />
                <Route path="register-patient" element={<NurseRegisterPatient />} />
                <Route path="vitals" element={<NurseVitals />} />
                <Route path="patients" element={<NursePatients />} />
                <Route path="profile" element={<AccountProfile />} />
                <Route path="settings" element={<AccountSettings />} />
            </Route>


            {/* Admin */}
            <Route path="/admin" element={<AppLayout role="admin" />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="audit-logs" element={<AdminAuditLogs />} />
                <Route path="profile" element={<AccountProfile />} />
                <Route path="settings" element={<AccountSettings />} />
            </Route>


            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
    )

}
