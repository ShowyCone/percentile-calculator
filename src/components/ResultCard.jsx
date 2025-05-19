// src/components/ResultCard.jsx

const ResultCard = ({ results }) => {
  function interpretarZ(z) {
    if (z < -3) return 'muy por debajo del esperado'
    if (z < -2) return 'por debajo del esperado'
    if (z < -1) return 'ligeramente por debajo del promedio'
    if (z < 1) return 'dentro del rango normal'
    if (z < 2) return 'ligeramente por encima del promedio'
    if (z < 3) return 'por encima del esperado'
    return 'muy por encima del esperado'
  }

  function getColorByZ(z) {
    if (z < -2) return 'bg-red-500'
    if (z < -1) return 'bg-orange-500'
    if (z <= 1) return 'bg-green-500'
    if (z <= 2) return 'bg-blue-500'
    return 'bg-blue-600'
  }

  const renderResult = (label, data) => (
    <div className='bg-white p-4 rounded shadow border space-y-1'>
      <h4 className='font-semibold'>{label}</h4>
      <p>Z-Score: {data.z.toFixed(2)}</p>
      <p>Percentil: {data.percentile}%</p>
      <p
        className={`text-white text-sm px-2 py-1 rounded font-medium ${getColorByZ(
          data.z
        )}`}
      >
        Interpretación: {interpretarZ(data.z)}
      </p>
    </div>
  )

  return (
    <div className='grid grid-cols-1 gap-4 mt-4'>
      {results.weight && renderResult('Peso para la edad', results.weight)}
      {results.length && renderResult('Talla para la edad', results.length)}
      {results.weightLength &&
        renderResult('Peso para la talla', results.weightLength)}
      {results.head &&
        renderResult('Circunferencia cefálica para la edad', results.head)}
    </div>
  )
}

export default ResultCard
