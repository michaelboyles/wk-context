import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vitejs.dev/config/
export default defineConfig({
    base: '',
    plugins: [
        babel({
            plugins: [
                ['@babel/plugin-syntax-typescript', { isTSX: true }],
                'jsx-conditionals/babel'
            ],
            include: /\.tsx$/,
            exclude: "**/node_modules/**"
        }),
        react(),
    ],
})
