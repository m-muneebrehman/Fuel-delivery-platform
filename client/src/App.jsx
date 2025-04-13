import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <button 
        className="bg-blue-400 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow"
        onClick={() => setCount(count + 1)}
      >
        Count is {count}
      </button>
    </>
  )
}

export default App
