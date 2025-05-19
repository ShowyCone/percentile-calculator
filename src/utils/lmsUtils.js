// src/utils/lmsUtils.js

export function calculateZScore({ L, M, S }, measurement) {
  if (L === 0) {
    return Math.log(measurement / M) / S
  }
  return (Math.pow(measurement / M, L) - 1) / (L * S)
}

export function zScoreToPercentile(z) {
  const p = 0.5 * (1 + erf(z / Math.SQRT2))
  return Math.round(p * 1000) / 10 // e.g. 87.6%
}

function erf(x) {
  // Approximation of error function
  const sign = Math.sign(x)
  x = Math.abs(x)

  const a1 = 0.254829592
  const a2 = -0.284496736
  const a3 = 1.421413741
  const a4 = -1.453152027
  const a5 = 1.061405429
  const p = 0.3275911

  const t = 1 / (1 + p * x)
  const y =
    1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x)

  return sign * y
}
