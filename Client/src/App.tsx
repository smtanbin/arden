import { Container } from "react-bootstrap"
import AppNavbar from "./Components/Navbar"
import ProfilePage from "./Pages/ProfilePage"

function App() {
  return (
    <main>
      <AppNavbar />
      <Container>
        <ProfilePage />
      </Container>
    </main>
  )
}

export default App
