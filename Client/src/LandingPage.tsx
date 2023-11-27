import { Container } from "react-bootstrap"
import AppNavbar from "./Components/Navbar"
import { Outlet } from "react-router-dom";
import Footer from "./Components/Footer"

interface LandingPageProps {
  children: React.ReactNode;
}


const LandingPage: React.FC<LandingPageProps> = () => {
  return (
    <main>
      <AppNavbar />
      <Container>
        {/* <LoginPage /> */}
        <Outlet />
        {/* <Dashboard /> */}
      </Container>
      <Footer />
    </main>
  )
}

export default LandingPage
