import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Nav from './components/Nav'
import Header from './components/Header'
import Main from './components/Main'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <>
      <Nav/>
      <Header/>
      <Main/>
    </>
  </StrictMode>,
)
