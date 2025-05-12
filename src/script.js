import * as THREE from 'three'
import GUI from 'lil-gui'
import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const gui = new GUI()

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
// Canvas
const canvas = document.querySelector("canvas")

// Scene
const scene = new THREE.Scene()

// Texture loader
const textureLoader = new THREE.TextureLoader()
// load the matcap texture
//const matcap = textureLoader.load('matcap.png')

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, .1, 100)
camera.position.z = 3
scene.add(camera)

// Update sizes and camera when resizing the window
window.addEventListener('resize', () => {
    // Sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerWidth

    // Camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Cube de test
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial()
)

scene.add(cube)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


// Clock
const clock = new THREE.Clock()

// Refresh function
const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    
    // Updating the controls
    controls.update()

    // update the renderer
    renderer.render(scene, camera)

    // Call next frame
    window.requestAnimationFrame(tick)
}

tick()