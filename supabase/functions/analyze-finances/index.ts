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
      .select(`
        amount, 
        type, 
        category_id,
        categories(name),
        created_at, 
        note
      `)
      .eq('user_id', user_id)
      .gte('created_at', firstDayCurrentMonth.toISOString())
      .order('created_at', { ascending: true })

    if (currentError) throw new Error('Error fetching current month data: ' + currentError.message)

    // Get previous month transactions
    const { data: previousMonthData, error: previousError } = await supabase
      .from('transactions')
      .select(`
        amount, 
        type, 
        category_id,
        categories(name),
        created_at, 
        note
      `)
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
        `[$${t.amount}] ${t.type} - ${t.categories.name} (${t.created_at.split("T")[0]})${t.note ? `: ${t.note}` : ''}`
      ).join("\n")
    }

    console.log('currentMonthData', currentMonthData)
    console.log('previousMonthData', previousMonthData);
    console.log('currentTotal', currentTotal);
    console.log('previousTotal', previousTotal);
    console.log('formatTransactions currentMonthData', formatTransactions(currentMonthData));
    console.log('formatTransactions previousMonthData', formatTransactions(previousMonthData));

    // Prepare data for OpenAI analysis
    const prompt = `Analiza los siguientes datos de gastos y proporciona un análisis detallado en formato Markdown, comenzando DIRECTAMENTE con el punto 1, sin ninguna introducción o saludo.

    GASTOS DEL MES ACTUAL (${currentDate.toLocaleString('es', { month: 'long' })}):
    Total gastado: $${Math.abs(currentTotal)}
    Desglose de gastos: 
    ${formatTransactions(currentMonthData)}

    GASTOS DEL MES ANTERIOR (${firstDayPreviousMonth.toLocaleString('es', { month: 'long' })}):
    Total gastado: $${Math.abs(previousTotal)}
    Desglose de gastos:
    ${formatTransactions(previousMonthData)}

    IMPORTANTE: 
    1. Comienza tu respuesta DIRECTAMENTE con "## 1. Comparación general entre los gastos de ambos meses" sin ningún texto introductorio.
    2. Usa formato Markdown:
       - ## para los títulos principales (1-7)
       - **texto** para resaltar cifras importantes y conclusiones clave
       - - para bullets points
       - \`$\` para cantidades monetarias

    Incluye los siguientes puntos numerados con ##:
    1. Una comparación general entre los gastos de ambos meses
    2. Identificación de las categorías donde hubo cambios significativos en el nivel de gasto
    3. Patrones de gasto detectados (días específicos, categorías más frecuentes, etc.)
    4. Recomendaciones específicas para reducir gastos en las categorías más significativas
    5. Identificación de gastos que podrían ser excesivos o innecesarios
    6. Sugerencias prácticas para optimizar el presupuesto en las categorías con mayor gasto
    7. Si no hay gastos en el mes anterior, analiza los patrones del mes actual y proporciona recomendaciones basadas en esos datos

    Responde en español, de manera clara y concisa, usando un tono profesional pero amigable. Enfócate en proporcionar consejos prácticos y alcanzables para la reducción y optimización de gastos.`;

    console.log('prompt', prompt);

    // Get OpenAI analysis
    const completion = await openAI.chat.completions.create({
      model: 'gpt-4.1-mini',
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

