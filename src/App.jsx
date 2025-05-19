// src/App.jsx

import Calculator from './components/Calculator'

function App() {
  return (
    <main className='min-h-screen bg-gray-100 p-6'>
      <h1 className='text-2xl font-bold text-center mb-6'>
        Calculadora de Percentiles Infantiles - OMS (Nacimiento a 24 meses)
      </h1>
      <Calculator />
    </main>
  )
}

export default App
