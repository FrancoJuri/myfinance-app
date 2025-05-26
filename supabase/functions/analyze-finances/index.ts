// @ts-nocheck
import { createClient } from "npm:@supabase/supabase-js@2.39.3";
import OpenAI from "npm:openai@4.24.1";
import { corsHeaders } from '../_shared/cors.ts';

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

 // Initialize OpenAI
 const openAI = new OpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY'),
})


Deno.serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {

    const { user_id } = await req.json();

    // Get current month's first day
    const currentDate = new Date()
    const firstDayCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    
    // Get previous month's first and last day
    const firstDayPreviousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    const lastDayPreviousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0)

    console.log('first day current month', firstDayCurrentMonth)
    console.log('first day previous month', firstDayPreviousMonth);
    console.log('last day previous month', lastDayPreviousMonth);

    // Get current month transactions
    const { data: currentMonthData, error: currentError } = await supabase
      .from('transactions')
      .select('amount, type, category_id, created_at, note')
      .eq('user_id', user_id)
      .gte('created_at', firstDayCurrentMonth.toISOString())
      .order('created_at', { ascending: true })

    if (currentError) throw new Error('Error fetching current month data: ' + currentError.message)

    // Get previous month transactions
    const { data: previousMonthData, error: previousError } = await supabase
      .from('transactions')
      .select('amount, type, category_id, created_at, note')
      .eq('user_id', user_id)
      .gte('created_at', firstDayPreviousMonth.toISOString())
      .lt('created_at', lastDayPreviousMonth.toISOString())
      .order('created_at', { ascending: true })

    if (previousError) throw new Error('Error fetching previous month data: ' + previousError.message)

    // Calculate totals for both months
    const currentTotal = currentMonthData.reduce((sum, transaction) => 
      transaction.type === 'expense' ? sum - transaction.amount : sum + transaction.amount, 0)
    
    const previousTotal = previousMonthData.reduce((sum, transaction) => 
      transaction.type === 'expense' ? sum - transaction.amount : sum + transaction.amount, 0)

    const formatTransactions = (data) => {
      return data.map(t =>
        `[$${t.amount}] ${t.type} - ${t.category_id} (${t.created_at.split("T")[0]})${t.note ? `: ${t.note}` : ''}`
      ).join("\n")
    }

    console.log('currentMonthData', currentMonthData)
    console.log('previousMonthData', previousMonthData);
    console.log('currentTotal', currentTotal);
    console.log('previousTotal', previousTotal);
    console.log('formatTransactions currentMonthData', formatTransactions(currentMonthData));
    console.log('formatTransactions previousMonthData', formatTransactions(previousMonthData));

    // Prepare data for OpenAI analysis
    const prompt = `Como asistente financiero experto, analiza los siguientes datos financieros y proporciona un análisis detallado:

    DATOS DEL MES ACTUAL (${currentDate.toLocaleString('es', { month: 'long' })}):
    Total: $${currentTotal}
    Transacciones: 
    ${formatTransactions(currentMonthData)}

    DATOS DEL MES ANTERIOR (${firstDayPreviousMonth.toLocaleString('es', { month: 'long' })}):
    Total: $${previousTotal}
    Transacciones:
    ${formatTransactions(previousMonthData)}

    Por favor, proporciona un análisis que incluya:
    1. Una comparación general entre ambos meses (gastos totales, ingresos, balance)
    2. Identificación de las categorías donde hubo cambios significativos
    3. Patrones de gasto detectados
    4. Recomendaciones específicas para mejorar las finanzas
    5. Áreas de oportunidad para ahorro
    6. Cualquier tendencia preocupante que requiera atención
    7. Si no hay transacciones en el mes anterior, simplemente indica recomendaciones generales para el mes actual.

    Responde en español, de manera clara y concisa, usando un tono profesional pero amigable.`;

    console.log('prompt', prompt);

    // Get OpenAI analysis
    const completion = await openAI.chat.completions.create({
      model: 'gpt-4.1',
      messages: [
        {
          role: "system",
          content: "Eres un asesor financiero experto que ayuda a usuarios a entender y mejorar sus finanzas personales."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
    })

    console.log('completion', completion);

    // Return the analysis
    return new Response(
      JSON.stringify({
        analysis: completion.choices[0].message.content,
        currentMonthTotal: currentTotal,
        previousMonthTotal: previousTotal,
        currentMonthTransactions: currentMonthData.length,
        previousMonthTransactions: previousMonthData.length
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  }
})

