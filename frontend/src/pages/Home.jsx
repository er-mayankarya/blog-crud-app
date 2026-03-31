import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Header from '../components/Header.jsx'
import BlogList from '../components/BlogList.jsx'
import Newsletter from '../components/Newsletter.jsx'
import Footer from '../components/Footer.jsx'

const Home = () => {
  const location = useLocation()

  useEffect(() => {
    if (!location.hash) return

    const timeoutId = window.setTimeout(() => {
      document.getElementById(location.hash.replace('#', ''))?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)

    return () => window.clearTimeout(timeoutId)
  }, [location.hash])

  return (
    <div className="ethereal-shell min-h-screen overflow-x-hidden">
      <div className="ethereal-orb ethereal-orb-primary" />
      <div className="ethereal-orb ethereal-orb-secondary" />

      <Navbar containerClassName="mx-auto w-full px-4 sm:px-6 lg:px-10" />
      <Header containerClassName="mx-auto w-full px-4 sm:px-6 lg:px-10" />
      <BlogList containerClassName="mx-auto w-full px-4 sm:px-6 lg:px-10" />
      <Newsletter containerClassName="mx-auto w-full px-4 sm:px-6 lg:px-10" />
      <Footer containerClassName="mx-auto w-full px-4 sm:px-6 lg:px-10" />
    </div>
  )
}

export default Home
