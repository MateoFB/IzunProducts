import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        // acá sólo van plugins de babel (strings o [string, opts])
        plugins: [
          ['babel-plugin-react-compiler']
        ]
      },
    }),
    tailwindcss(), // <- plugin de Vite, al mismo nivel que react()
  ],
})