import { useState } from 'react'
import './App.scss'
import Routes from './pages/Routes'
import { useAuthContext } from './contexts/AuthContext'
import ScreenLoader from './components/ScreenLoader'
function App() {
  const {isAppLoading} = useAuthContext()
  console.log('isAppLoading', isAppLoading)

  return (
    <>
  {isAppLoading
     ?<ScreenLoader /> 
    : 
   <Routes />
  }
  </>
)
}

export default App
