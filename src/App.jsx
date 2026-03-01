import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import {Hero} from './sections/Hero'
import {Navbar} from './layout/Navbar'
import {About} from './sections/About'  
import {Projects} from './sections/Projects'
import {Contact} from './sections/Contact'
import Footer from './layout/Footer'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Projects />
        <Contact/>
      </main>
      <Footer/>
    </div>
  )
}

export default App
