import { Container } from "react-bootstrap"
import AppNavbar from "./Components/Navbar"
import LoginPage from "./Pages/LoginPage"
import Footer from "./Components/Footer"
import Dashboard from "./Pages/Dashboard/Dashboard"
// import ProfilePage from "./Pages/ProfilePage"

function App() {
  return (
    <main>
      <AppNavbar />
      <Container>
        {/* <LoginPage /> */}
        <Dashboard />
      </Container>
      <Footer />
    </main>
  )
}

export default App
