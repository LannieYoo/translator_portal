import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Header from '../header/header'
import Footer from '../footer/footer'
import './layout.css'

function Layout({ children }) {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="layout">
      <Header />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout

