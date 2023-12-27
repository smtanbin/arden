
import AppNavbar from "./Components/Navbar"
import { Outlet } from "react-router-dom";
import FooterComponent from "./Components/FooterComponent"
import { Footer, Container, Content } from "rsuite";

interface LandingPageProps {
  children: React.ReactNode;
}


const LandingPage: React.FC<LandingPageProps> = () => {
  return (

    <Container>
      <AppNavbar />
      <Content>
        <Outlet />
      </Content>
      <Footer>
        <FooterComponent />
      </Footer>
    </Container>


  )
}

export default LandingPage
