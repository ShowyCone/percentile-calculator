// src/utils/lmsUtils.js

// Función para calcular el Z-Score basado en los parámetros LMS
export const calculateZScore = (lmsData, value) => {
  if (!lmsData || value === null || value === undefined) return null

  const { L, M, S } = lmsData
  if (L === 0) {
    return (Math.log(value) - Math.log(M)) / S
  }
  return (Math.pow(value / M, L) - 1) / (L * S)
}

// Función para convertir Z-Score a percentil
export const zScoreToPercentile = (z) => {
  if (z === null || z === undefined) return null

  // Usamos la aproximación de la función de distribución acumulativa normal
  const percent =
    100 *
    (1 -
      0.5 *
        Math.pow(
          1 +
            0.196854 * Math.abs(z) +
            0.115194 * Math.pow(Math.abs(z), 2) +
            0.000344 * Math.pow(Math.abs(z), 3) +
            0.019527 * Math.pow(Math.abs(z), 4),
          -4
        ))

  // Redondeamos a 1 decimal
  return z < 0
    ? parseFloat((100 - percent).toFixed(1))
    : parseFloat(percent.toFixed(1))
}

// Función principal que calcula todos los percentiles
export const calculateAllPercentiles = (datasets, inputs) => {
  const { sex, age, weight, length, head } = inputs

  if (!age || age.completedMonths === null) {
    throw new Error('La edad no es válida.')
  }

  const ageStr = age.completedMonths.toString()
  const results = {}

  // Peso para la edad
  if (weight && datasets.weight[sex][ageStr]) {
    const z = calculateZScore(datasets.weight[sex][ageStr], parseFloat(weight))
    results.weight = { z, percentile: zScoreToPercentile(z) }
  }

  // Talla para la edad
  if (length && datasets.length[sex][ageStr]) {
    const z = calculateZScore(datasets.length[sex][ageStr], parseFloat(length))
    results.length = { z, percentile: zScoreToPercentile(z) }
  }

  // Peso para la talla
  if (length && weight && datasets.weightLength[sex][Math.round(length)]) {
    const z = calculateZScore(
      datasets.weightLength[sex][Math.round(length)],
      parseFloat(weight)
    )
    results.weightLength = { z, percentile: zScoreToPercentile(z) }
  }

  // Perímetro cefálico para la edad
  if (head && datasets.head[sex][ageStr]) {
    const z = calculateZScore(datasets.head[sex][ageStr], parseFloat(head))
    results.head = { z, percentile: zScoreToPercentile(z) }
  }

  return results
}
