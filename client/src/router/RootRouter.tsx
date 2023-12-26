import { Routes, Route } from "react-router-dom"
import LoadingPage from "../Components/LandingPage"
import SecureRoute from "./SecureRoute"
// import ProfilePage from "../Pages/ProfilePage.tsx.bk"
import SignInPage from "../Pages/LoginPage/SignInPage"
import Dashboard from "../Pages/Dashboard/Dashboard"
import ErrorPage from "../Pages/errorPage"
import Activation from "../Pages/Activation/Activation"
import DisputeEntry from "../Pages/Dispute/DisputeEntry"
import DisputeList from "../Pages/Dispute/DisputeList/DisputeList"
import PasswordReset from "../Pages/LoginPage/PasswordReset"
import SignUp from "../Pages/LoginPage/SignUpPage"
import DisputeChecker from "../Pages/Dispute/DisputeList/DisputeChecker"
import ApproveProfile from "../Pages/System/Profile/ApproveProfile"
import ServerConnectionFailed from "../Components/ServerConnectionFailed"






const RootRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<SecureRoute children={undefined} />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/home" element={<Dashboard />} />
                {/* <Route path="/userprofile" element={<ProfilePage />} /> */}
                <Route path="/cardActivation" element={<Activation />} />
                <Route path="/addDispute" element={<DisputeEntry />} />
                <Route path="/disputeList" element={<DisputeList />} />
                <Route path="/disputeChecker/:param" element={<DisputeChecker />} />
                <Route path="/approveProfile" element={<ApproveProfile />} />
            </Route>
            <Route path="/500" element={<ServerConnectionFailed />} />
            <Route path="/loading" element={<LoadingPage />} />
            <Route path="/login" element={<SignInPage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/PasswordReset" element={<PasswordReset />} />
            <Route path="*" element={<ErrorPage />} />
        </Routes>
    )
}
export default RootRouter