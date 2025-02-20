import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Camera from './components/Elements/Camera'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Camera/>
    </>
  )
}

export default App
