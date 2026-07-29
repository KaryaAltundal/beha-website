import './App.css'
import { About } from './components/About'
import { Contact } from './components/Contact'
import { Hero } from './components/Hero'
import { Navbar } from './components/Navbar'
import { References } from './components/References'
import { Services } from './components/Services'

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <References />
        <Contact />
      </main>
    </>
  )
}

export default App
