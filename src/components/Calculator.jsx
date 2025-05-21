// src/components/Calculator.jsx

import { useState } from 'react'
import { calculateZScore, zScoreToPercentile } from '../utils/lmsUtils'
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
    if (!age || age.completedMonths === null) {
      alert('La edad no es válida. Verifique la fecha de nacimiento.')
      return
    }

    const res = {}

    const ageStr = age.completedMonths.toString()

    if (age.completedMonths < 0 || age.completedMonths > 24) {
      alert(
        'La edad debe estar entre 0 y 24 meses (según los datos disponibles).'
      )
      return
    }

    if (weight && datasets.weight[sex][ageStr]) {
      const z = calculateZScore(
        datasets.weight[sex][ageStr],
        parseFloat(weight)
      )
      res.weight = { z, percentile: zScoreToPercentile(z) }
    }

    if (length && datasets.length[sex][ageStr]) {
      const z = calculateZScore(
        datasets.length[sex][ageStr],
        parseFloat(length)
      )
      res.length = { z, percentile: zScoreToPercentile(z) }
    }

    if (length && weight && datasets.weightLength[sex][Math.round(length)]) {
      const z = calculateZScore(
        datasets.weightLength[sex][Math.round(length)],
        parseFloat(weight)
      )
      res.weightLength = { z, percentile: zScoreToPercentile(z) }
    }

    if (head && datasets.head[sex][ageStr]) {
      const z = calculateZScore(datasets.head[sex][ageStr], parseFloat(head))
      res.head = { z, percentile: zScoreToPercentile(z) }
    }

    setResults(res)
  }

  const calcularEdadPediatrica = (fechaNacimiento) => {
    const hoy = new Date()
    const nacimiento = new Date(fechaNacimiento)

    // Cálculo preciso para pediatría
    let años = hoy.getFullYear() - nacimiento.getFullYear()
    let meses = hoy.getMonth() - nacimiento.getMonth()
    let dias = hoy.getDate() - nacimiento.getDate()

    // Ajustar por días negativos
    if (dias < 0) {
      meses--
      // Obtener último día del mes anterior
      const ultimoDiaMesAnterior = new Date(
        hoy.getFullYear(),
        hoy.getMonth(),
        0
      ).getDate()
      dias += ultimoDiaMesAnterior
    }

    // Ajustar por meses negativos
    if (meses < 0) {
      años--
      meses += 12
    }

    // Meses completos (para percentiles)
    const completedMonths = años * 12 + meses

    // Meses con fracción (para visualización)
    const mesesDecimal = completedMonths + dias / 30.437

    // Cálculo de semanas y días
    const totalDias = Math.floor((hoy - nacimiento) / (1000 * 60 * 60 * 24))
    const semanasCompletas = Math.floor(totalDias / 7)
    const diasRestantes = totalDias % 7

    return {
      years: años,
      months: meses,
      days: dias,
      completedMonths: años * 12 + meses,
      monthsDecimal: parseFloat(mesesDecimal.toFixed(2)),
      weeks: semanasCompletas,
      remainingDays: diasRestantes,
      totalDays: totalDias,
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

  const formatAgeDisplay = (age) => {
    if (!age) return 'No se pudo calcular la edad'

    if (age.completedMonths < 1) {
      return `${age.totalDays} días (${age.weeks} semanas y ${age.remainingDays} días)`
    } else if (age.years < 2) {
      return `${age.completedMonths} meses y ${age.days} días`
    } else {
      return `${age.years} años y ${age.months} meses`
    }
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
