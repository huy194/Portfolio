import { lazy, Suspense } from 'react'
import {Hero} from './sections/Hero'
import {Navbar} from './layout/Navbar'
import {About} from './sections/About'  
import {Projects} from './sections/Projects'
import {Contact} from './sections/Contact'
import Footer from './layout/Footer'
import { useShouldRenderScene3D } from './hooks/useShouldRenderScene3D'
const Scene3D = lazy(() => import('./three/Scene3D'))

function App() {
  const shouldRenderScene3D = useShouldRenderScene3D()

  return (
    <div className="min-h-screen overflow-x-hidden">
      {shouldRenderScene3D && (
        <Suspense fallback={null}>
          <Scene3D />
        </Suspense>
      )}
      <Navbar />
      <main className="relative z-10">
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
