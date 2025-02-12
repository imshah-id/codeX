import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Nav from './components/Nav'
import Header from './components/Header'
import Main from './components/Main'
import Languages from './components/Languages'
import Progress from './components/Progress'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <>
      <Nav/>
      <Header/>
      <Main/>
      <Progress/>
      <Languages/>
    </>
  </StrictMode>,
)
