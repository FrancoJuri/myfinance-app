import { calculateDailyTotal, calculateMonthlyTotal, calculateWeeklyTotal } from './calculateTotals.js';

// Crear más transacciones de prueba
const transaccionesPrueba = [
  {
    amount: 100,
    created_at: new Date().toISOString() // Hoy (25/5)
  },
  {
    amount: 200,
    created_at: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString() // 23/5
  },
  {
    amount: 300,
    created_at: new Date(new Date().setDate(new Date().getDate() - 4)).toISOString() // 21/5
  },
  {
    amount: 400,
    created_at: new Date(new Date().setDate(new Date().getDate() - 6)).toISOString() // 19/5
  },
  {
    amount: 500,
    created_at: new Date(new Date().setDate(new Date().getDate() - 8)).toISOString() // 17/5 (NO cuenta en semanal)
  },
  {
    amount: 600,
    created_at: new Date(new Date().setDate(1)).toISOString() // 1/5 (SÍ cuenta en mensual)
  },
  {
    amount: 700,
    created_at: new Date(new Date().setMonth(new Date().getMonth() - 1, 15)).toISOString() // 15/4 (NO cuenta en mensual)
  }
];

// Agregar logs de debug
const today = new Date();
console.log('===== DEBUG INFORMACIÓN =====');
console.log('Hoy es:', today.toLocaleDateString());
console.log('\nTransacciones:');
transaccionesPrueba.forEach(t => {
  const fecha = new Date(t.created_at);
  const diasAtras = Math.round((today - fecha) / (1000 * 60 * 60 * 24));
  console.log(`Fecha: ${fecha.toLocaleDateString()}, Monto: $${t.amount} (hace ${diasAtras} días)`);
});

// Mostrar períodos
const startOfWeek = new Date(today);
startOfWeek.setDate(today.getDate() - 7);
const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

console.log('\nPeríodos de tiempo:');
console.log('Período semanal: últimos 7 días desde', startOfWeek.toLocaleDateString());
console.log('Período mensual: mes actual desde', startOfMonth.toLocaleDateString());

// Calcular los totales
const totalDiario = calculateDailyTotal(transaccionesPrueba);
const totalSemanal = calculateWeeklyTotal(transaccionesPrueba);
const totalMensual = calculateMonthlyTotal(transaccionesPrueba);

console.log('\n===== RESULTADOS =====');
console.log('Total de hoy:', totalDiario);
console.log('Total últimos 7 días:', totalSemanal);
console.log('Total del mes actual:', totalMensual);

console.log('\n===== DESGLOSE =====');
console.log('En el total diario solo cuenta la transacción de hoy ($100)');
console.log('En el total semanal cuentan las transacciones de los últimos 7 días ($100 + $200 + $300 + $400)');
console.log('En el total mensual cuentan todas las transacciones del mes actual (desde el día 1)');