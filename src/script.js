import * as THREE from 'three'
import GUI from 'lil-gui'
import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/Addons.js';
import typefaceFont from 'three/examples/fonts/helvetiker_regular.typeface.json'

const gui = new GUI()

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    number: 200
}
// Canvas
const canvas = document.querySelector("canvas")

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader()
// Font loader
const fontLoader = new FontLoader()

const text = null
// load the matcap texture
const matcap = textureLoader.load('matcap.png')
matcap.colorSpace = THREE.SRGBColorSpace

const matcapMat = new THREE.MeshMatcapMaterial({matcap: matcap})

// Load the font
fontLoader.load('fonts/helvetiker_regular.typeface.json', function(font){
    const textGeo = new TextGeometry("ECID SAS Chalicarne", {
        font: font,
        size: 0.5,
        depth: .2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: .05,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5
    })
    const text = new THREE.Mesh(textGeo, matcapMat)
    textGeo.computeBoundingBox()
    textGeo.center()
    textGeo.translate(0, 0, -2)
    scene.add(text) 
})

const array = []

// Random objects everywhere
for(let i = 0; i < sizes.number; i++){
    let geoRand = null
    const type = Math.floor(Math.random() * 3);
    switch (type){
        case 0:
            geoRand = new THREE.SphereGeometry(.5, 16, 16)
            break
        case 1:
            geoRand = new THREE.TorusKnotGeometry(.2, .1)
            break
        case 2:
            geoRand = new THREE.TorusGeometry(.2, .1, 16)
    }
    const mesh = new THREE.Mesh(geoRand, matcapMat)
    mesh.position.set(
        (Math.random() - .5) * 20,
        (Math.random() - .5) * 20,
        (Math.random() - .5) * 20
    )
    mesh.rotation.set(Math.random()* Math.PI, Math.random()* Math.PI, Math.random()* Math.PI)
    const scaleRand = Math.random() + .2
    mesh.scale.set(scaleRand, scaleRand, scaleRand)
    scene.add(mesh)
    array.push(mesh)
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, .1, 100)
camera.position.z = 3
scene.add(camera)

// Update sizes and camera when resizing the window
window.addEventListener('resize', () => {
    // Sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

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
    new THREE.MeshMatcapMaterial({matcap: matcap})
)
cube.position.set(1, -1 ,0)

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
    cube.lookAt(camera.position)

    // Updating rotation of the random objects
    array.forEach((m) => {
        m.rotation.set(Math.PI+elapsedTime, Math.PI+elapsedTime, Math.PI+elapsedTime)
    })
    
    // Updating the controls
    controls.update()

    // update the renderer
    renderer.render(scene, camera)

    // Call next frame
    window.requestAnimationFrame(tick)
}

tick()