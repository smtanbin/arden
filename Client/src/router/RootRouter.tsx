import { Routes, Route } from "react-router-dom"
import LoadingPage from "../Components/LandingPage"
import SecureRoute from "./SecureRoute"
import ProfilePage from "../Pages/ProfilePage"
import LoginPage from "../Pages/LoginPage"
import Dashboard from "../Pages/Dashboard/Dashboard"
import ErrorPage from "../Pages/errorPage"
import Activation from "../Pages/Activation/Activation"




const RootRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<SecureRoute children={undefined} />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/userprofile" element={<ProfilePage />} />
                <Route path="/cardActivation" element={<Activation />} />
            </Route>
            <Route path="/loading" element={<LoadingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<ErrorPage />} />
        </Routes>
    )
}
export default RootRouter