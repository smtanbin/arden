import { Routes, Route } from "react-router-dom"
import LoadingPage from "../Components/LandingPage"
import SecureRoute from "./SecureRoute"
// import ProfilePage from "../Pages/ProfilePage.tsx.bk"
import SignInPage from "../Pages/LoginPage/SignInPage"
import Dashboard from "../Pages/Dashboard/Dashboard"
import ErrorPage from "../Pages/errorPage"
import CardActivationMaker from "../Pages/Activation/CardActivationMaker"
import DisputeEntry from "../Pages/Dispute/DisputeEntry"
import DisputeList from "../Pages/Dispute/DisputeList/DisputeList"
import PasswordReset from "../Pages/LoginPage/PasswordReset"
import SignUp from "../Pages/LoginPage/SignUpPage"
import DisputeChecker from "../Pages/Dispute/DisputeList/DisputeChecker"
import ApproveProfile from "../Pages/System/Profile/ApproveProfile"
import ServerConnectionFailed from "../Components/ServerConnectionFailed"
import AddUser from "../Pages/System/Profile/AddUser"






const RootRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<SecureRoute children={undefined} />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/home" element={<Dashboard />} />
                {/* <Route path="/userprofile" element={<ProfilePage />} /> */}
                <Route path="/card_activation_maker" element={<CardActivationMaker />} />
                <Route path="/dispute_maker" element={<DisputeEntry />} />
                <Route path="/dispute_list" element={<DisputeList />} />
                <Route path="/dispute_checker/:param" element={<DisputeChecker />} />
                <Route path="/approve_profile" element={<ApproveProfile />} />
                <Route path="/add_user" element={<AddUser />} />
            </Route>
            <Route path="/500" element={<ServerConnectionFailed />} />
            <Route path="/loading" element={<LoadingPage />} />
            <Route path="/login" element={<SignInPage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/password_reset" element={<PasswordReset />} />
            <Route path="*" element={<ErrorPage />} />
        </Routes>
    )
}
export default RootRouter