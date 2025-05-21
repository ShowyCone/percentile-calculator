// src/utils/ageUtils.js

export const calcularEdadPediatrica = (fechaNacimiento) => {
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

export const formatAgeDisplay = (age) => {
  if (!age) return 'No se pudo calcular la edad'

  if (age.completedMonths < 1) {
    return `${age.totalDays} días (${age.weeks} semanas y ${age.remainingDays} días)`
  } else if (age.years < 2) {
    return `${age.completedMonths} meses y ${age.days} días`
  } else {
    return `${age.years} años y ${age.months} meses`
  }
}
