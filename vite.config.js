/*import {
    defineConfig
} from 'vite'
export default defineConfig({
    pulicDir: './assets',
    assetsInclude: [
        './assets/model/fake-casetta-obg/fakecasetta.mtl',
        './assets/model/fake-casetta-obg/fakecasetta.obj'
    ]
})*/

module.exports = {
    root: './',
    build: {
        outDir: 'dist',
    },
    publicDir: 'assets'
}