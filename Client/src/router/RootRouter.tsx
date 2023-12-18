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





const RootRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<SecureRoute children={undefined} />}>
                <Route path="/" element={<Dashboard />} />
                {/* <Route path="/userprofile" element={<ProfilePage />} /> */}
                <Route path="/cardActivation" element={<Activation />} />
                <Route path="/addDispute" element={<DisputeEntry />} />
                <Route path="/disputeList" element={<DisputeList />} />
            </Route>
            <Route path="/loading" element={<LoadingPage />} />
            <Route path="/login" element={<SignInPage />} />
            <Route path="*" element={<ErrorPage />} />
        </Routes>
    )
}
export default RootRouter