import * as THREE from 'three'
import GUI from 'lil-gui'
import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/Addons.js';
import typefaceFont from 'three/examples/fonts/helvetiker_regular.typeface.json'
import * as CANNON from 'cannon-es' 

const gui = new GUI()

gui.hide()

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

/**
 * Physics
 */
const world = new CANNON.World()
world.gravity.set(0, -2, 0)
world.broadphase = new CANNON.SAPBroadphase(world)
world.allowSleep = true
// Materials for physic elements
const defaultMaterial = new CANNON.Material('default')
const contactMat = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
        friction: 0.1,
        restitution: 0.7
    }
)
world.addContactMaterial(contactMat)

// Load the font
fontLoader.load('fonts/helvetiker_regular.typeface.json', function(font){
    const textGeo = new TextGeometry("ECID SAS Chalicarne", {
        font: font,
        size: 3,
        depth: .8,
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
    textGeo.translate(0, 1.5, -2)
    scene.add(text) 

    // Physics for the text
    const textShape = new CANNON.Box(new CANNON.Vec3(textGeo.width, textGeo.height, textGeo.depth))
    const textBody = new CANNON.Body()
    textBody.addShape(textShape)
    world.addBody(textBody)
})


// Floor
const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body()
floorBody.addShape(floorShape)
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * .5)
world.addBody(floorBody)

/**
 * Objects
 */

// Floor
const floor = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshMatcapMaterial({ matcap }))
floor.rotation.x = - Math.PI * .5
scene.add(floor)

const array = []
const sphereGeo = new THREE.SphereGeometry(.5, 16, 16)
const boxGeo = new THREE.BoxGeometry(1, 1, 1)
const torusGeo = new THREE.TorusGeometry(.2, .1, 16)

/**
 * Functions to create objects
 */
const createSphere = (radius, position) => {
    // Threejs mesh
    const mesh = new THREE.Mesh(sphereGeo, matcapMat)
    mesh.scale.set(radius, radius, radius)
    mesh.position.copy(position)
    scene.add(mesh)

    // Cannonjs body
    const shape = new CANNON.Sphere(radius)
    const body = new CANNON.Body({
        mass: 1,
        position : new CANNON.Vec3(0, 3, 0),
        shape: shape,
        material: defaultMaterial
    })
    body.position.copy(position)
    world.addBody(body)

    // Save the object
    array.push({
        mesh,
        body
    })
}

const createTor = (radius, position) => {
    // Threejs mesh
    const mesh = new THREE.Mesh(torusGeo, matcapMat)
    mesh.scale.set(radius, radius, radius)
    mesh.position.copy(position)
    scene.add(mesh)

    // Cannonjs body
    const shape = CANNON.Trimesh.createTorus(radius, .1, 16)
    const body = new CANNON.Body({
        mass: 1, 
        position : new CANNON.Vec3(0, 3, 0),
        shape,
        material: defaultMaterial
    })
    body.position.copy(position)
    world.addBody(body)

    // Save the object
    array.push({
        mesh,
        body
    })
}

const createBox = (radius, position) => {
    // Threejs mesh
    const mesh = new THREE.Mesh(boxGeo, matcapMat)
    mesh.scale.set(radius, radius, radius)
    mesh.position.copy(position)
    scene.add(mesh)

    // Cannonjs body
    const shape = new CANNON.Box(new CANNON.Vec3(radius / 2, radius / 2, radius / 2)) // Pour définir la taille, on utilise un half-extent (un vecteur du centre du cube jusqu'à un coin du cube)
    const body = new CANNON.Body({
        mass: 1,
        position : new CANNON.Vec3(0, 3, 0),
        shape: shape,
        material: defaultMaterial
    })
    body.position.copy(position)
    world.addBody(body)

    // Save the object
    array.push({
        mesh,
        body
    })
}


// Random objects everywhere
for(let i = 0; i < sizes.number; i++){
    const type = Math.floor(Math.random() * 3);
    switch (type){
        case 0:
            // create Sphere
            createSphere(Math.random() * 2 + .6, new THREE.Vector3((Math.random() - .5) * 20, (Math.random()) * 20 + 5, (Math.random() - .5) * 20))
            break
        case 1:
            // create Box
            createBox(Math.random() * 2 + .6, new THREE.Vector3((Math.random() - .5) * 20, (Math.random()) * 20 + 5, (Math.random() - .5) * 20))
            break
        case 2:
            // Create torus
            createTor(Math.random() * 2 + .6, new THREE.Vector3((Math.random() - .5) * 20, (Math.random()) * 20 + 5, (Math.random() - .5) * 20))
            break;
    }
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, .1, 100)
camera.position.z = 20
camera.position.y = 5
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

/**
 * Protocole links
 */


// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


// Clock
const clock = new THREE.Clock()
let oldElapsedTime = 0

// Refresh function
const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime

    world.step(1/60, deltaTime, 3)
    // Updating position of the random objects with physics
    for(const m of array){
        m.mesh.position.copy(m.body.position)
        m.mesh.quaternion.copy(m.body.quaternion)   
    }

    // Updating the controls
    controls.update()

    // update the renderer
    renderer.render(scene, camera)

    // Call next frame
    window.requestAnimationFrame(tick)
}

tick()