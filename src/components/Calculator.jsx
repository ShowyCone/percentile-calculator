// src/components/Calculator.jsx

import { useState } from 'react'
import { calculateAllPercentiles } from '../utils/lmsUtils'
import { calcularEdadPediatrica, formatAgeDisplay } from '../utils/ageUtils'
import ResultCard from './ResultCard'

import weightData from '../data/weight_for_age.json'
import lengthData from '../data/length_for_age.json'
import weightLengthData from '../data/weight_for_length.json'
import headData from '../data/head_circumference_for_age.json'

const datasets = {
  weight: weightData,
  length: lengthData,
  weightLength: weightLengthData,
  head: headData,
}

const Calculator = () => {
  const [sex, setSex] = useState('male')
  const [age, setAge] = useState(null)
  const [weight, setWeight] = useState('')
  const [length, setLength] = useState('')
  const [head, setHead] = useState('')
  const [results, setResults] = useState(null)
  const [birthDate, setBirthDate] = useState('')
  const [ageError, setAgeError] = useState('')

  const handleCalculate = () => {
    try {
      const inputs = { sex, age, weight, length, head }
      const res = calculateAllPercentiles(datasets, inputs)
      setResults(res)
    } catch (error) {
      alert(error.message)
    }
  }

  const handleBirthDateChange = (e) => {
    const fecha = e.target.value
    setBirthDate(fecha)

    const edad = calcularEdadPediatrica(fecha)
    if (edad.completedMonths < 0 || edad.completedMonths > 24) {
      setAge(null)
      setAgeError('La edad debe estar entre 0 y 24 meses.')
    } else {
      setAge(edad)
      setAgeError('')
    }
  }

  const getMinBirthDate = () => {
    const hoy = new Date()
    hoy.setMonth(hoy.getMonth() - 24)
    return hoy.toISOString().split('T')[0]
  }

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0]
  }

  return (
    <div className='max-w-xl mx-auto p-4 space-y-4'>
      <h2 className='text-xl font-bold'>Calculadora de Percentiles (OMS)</h2>

      <div className='flex flex-col gap-2'>
        <label>
          Sexo:
          <select
            value={sex}
            onChange={(e) => setSex(e.target.value)}
            className='border rounded px-2 py-1 w-full'
          >
            <option value='male'>Masculino</option>
            <option value='female'>Femenino</option>
          </select>
        </label>

        <label>
          Fecha de nacimiento:
          <input
            type='date'
            value={birthDate}
            onChange={handleBirthDateChange}
            min={getMinBirthDate()}
            max={getTodayDate()}
            className='border rounded px-2 py-1 w-full'
          />
        </label>

        {ageError && <p className='text-red-600 text-sm mt-1'>{ageError}</p>}

        {age && (
          <div className='bg-blue-50 p-3 rounded-md mt-2'>
            <h3 className='font-semibold text-blue-800 mb-1'>
              Edad calculada:
            </h3>
            <p className='text-sm text-gray-800'>{formatAgeDisplay(age)}</p>
            <p className='text-xs text-gray-600 mt-1'>
              {age.completedMonths} Meses
            </p>
          </div>
        )}

        <label>
          Peso (kg):
          <input
            type='number'
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            step='0.01'
            className='border rounded px-2 py-1 w-full'
          />
        </label>

        <label>
          Talla (cm):
          <input
            type='number'
            value={length}
            onChange={(e) => setLength(e.target.value)}
            step='0.1'
            className='border rounded px-2 py-1 w-full'
          />
        </label>

        <label>
          Circunferencia Cefálica (cm):
          <input
            type='number'
            value={head}
            onChange={(e) => setHead(e.target.value)}
            step='0.1'
            className='border rounded px-2 py-1 w-full'
          />
        </label>

        <button
          onClick={handleCalculate}
          className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
        >
          Calcular Percentiles
        </button>
      </div>

      {results && <ResultCard results={results} />}
    </div>
  )
}

export default Calculator
