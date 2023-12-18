
import AppNavbar from "./Components/Navbar"
import { Outlet } from "react-router-dom";
import Footer from "./Components/Footer"
import { Container } from "rsuite";

interface LandingPageProps {
  children: React.ReactNode;
}


const LandingPage: React.FC<LandingPageProps> = () => {
  return (
    <main>
      <AppNavbar />
      <Container>
        <Outlet />
      </Container>
      <Footer />
    </main>
  )
}

export default LandingPage
