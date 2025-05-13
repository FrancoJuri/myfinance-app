Estoy creando una app de finanzas personales usando **Expo con React Native con JavaScript**. Estas son las tecnologías que quiero usar:

- Expo Router para navegación
- Supabase para autenticación y base de datos
- Redux Toolkit para manejo de estado global
- NativeWind para estilos tipo TailwindCSS

Necesito que generes toda la estructura inicial del proyecto, con carpetas organizadas y archivos necesarios, siguiendo estas indicaciones:

### Carpetas:

- `app/`: rutas de la app usando Expo Router
- `components/`: componentes reutilizables
- `redux/`: slices y store de Redux Toolkit
- `services/`: conexión a Supabase, API de IA, helpers
- `utils/`: utilidades como formateo de fechas o cálculos financieros
- `assets/`: iconos o imágenes si fueran necesarios

### Funcionalidades:

1. **Login con Google**

   - Usar Supabase Auth con Google
   - Si el usuario no está autenticado, redirigir a la pantalla de login
   - Guardar el usuario en Redux Toolkit

2. **Dashboard** (`/`)

   - Mostrar 3 números: gasto diario, semanal y mensual
   - Enlace para añadir gasto
   - Cargar datos desde Supabase (gastos por usuario)

3. **Pantalla Añadir Categoría** (`/categories`)

   - Formulario para crear categoría (nombre y color)
   - Guardar en Supabase

4. **Pantalla Añadir Gasto/Ingreso** (`/add`)

   - Formulario con: monto, tipo (gasto/ingreso), categoría, nota opcional, fecha
   - Guardar en Supabase

5. **Pantalla Perfil** (`/profile`)

   - Mostrar nombre, email y botón para cerrar sesión

6. **Asistente IA** (`/assistant`)
   - Detectar cambios como "este mes gastaste más en delivery"
   - Guardar análisis (resumen) en Supabase
   - Chat de una sola sesión (no persistente), usando OpenAI API simulada

### Extras:

- Configura Redux Toolkit y proporciona un ejemplo con el slice de usuario
- Configura Expo Router para navegación
- Deja comentarios claros en cada archivo generado
- Recuerda usar JavaScript y no TypeScript.
- NativeWind ya esta instalado y debes usarlo para los estilos.
- El archivo de configuracion de supabase ya esta escrito
- Si hay archivos con typescript borralos y hazlo todo con javascript. Los archivos que estan ahora cambialos por otros correspondientes a la app que quiero crear.

Generá la estructura del proyecto y empezá por los archivos mínimos necesarios para levantar la app: navegación, autenticación y dashboard básico.
