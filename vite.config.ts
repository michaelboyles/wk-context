import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import typescript from '@rollup/plugin-typescript'
import ttypescript from 'ttypescript'

// https://vitejs.dev/config/
export default defineConfig({
    base: '',
    plugins: [
        react(),
        typescript({
            typescript: ttypescript,
        })
    ],
})
