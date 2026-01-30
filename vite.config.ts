import tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import os from 'os'
import { defineConfig } from 'vite'

export default defineConfig(() => {
  const getLocalIp = () => {
    const interfaces = os.networkInterfaces()
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name]!) {
        if (iface.family === 'IPv4' && !iface.internal) {
          return iface.address
        }
      }
    }
    return 'localhost'
  }

  const localIp = getLocalIp()

  return {
    plugins: [
      TanStackRouterVite({ quoteStyle: 'single' }),
      react(),
      tailwindcss(),
    ],
    define: {
      __APP_URL__: JSON.stringify(`http://${localIp}:5173`),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})
