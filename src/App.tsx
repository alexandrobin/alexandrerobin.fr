//import { useState } from 'react'


import './App.css'
// import { Routes, Route } from 'react-router'
import Hero from './components/Hero.tsx'
import Experiences from './components/Experiences.tsx'
import Articles from './components/Articles.tsx'
import Footer from './components/Footer.tsx'

function App() {
  //const [count, setCount] = useState(0)

  return (
    <main>
      <Hero/>
      <Experiences/>
      <Articles/>
      <Footer/>
    </main>
  )
}

export default App
