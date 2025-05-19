import * as THREE from 'three'
import GUI from 'lil-gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/Addons.js';
import typefaceFont from 'three/examples/fonts/helvetiker_regular.typeface.json'
import * as CANNON from 'cannon-es' 
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/Addons.js';

const gui = new GUI()

gui.hide()

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    number: 200
}

const contexts = [
    {
        link : 'import_poids_volume.html',
        text : "Poids et volume"
    },
    {
        link : 'import_prix_achat.html',
        text : "Protocole pour les fournisseurs et leur prix de vente"
    },
    {
        link : 'import_prix_fourn.html',
        text : "Import des prix d'achat fournisseurs"
    },
    {
        link : 'import_regles_remise.html',
        text : "Import des regles de remise"
    },
    {
        link : 'inventaire_debut_annee.html',
        text : "Protocole pour l'inventaire"
    }
]
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
// DRACOLoader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')
// GLTFLoader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * Textures
 */
// load the matcap texture
const matcap = textureLoader.load('matcap.png')
matcap.colorSpace = THREE.SRGBColorSpace

const matcapMat = new THREE.MeshMatcapMaterial({matcap: matcap})

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster()
// Mouse 
const mouse = new THREE.Vector2()
// Update mouse position
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX / sizes.width * 2 - 1
    mouse.y = - (e.clientY / sizes.height) * 2 + 1
})
// Detect click on file
window.addEventListener('click', () => {
    if(currentIntersect){
        for (const m of fileModels){
            window.open(contexts[currentIntersect[0].index].link, '_blank')      
        }
    }
})
 
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

const texts = []
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

    // Texts for hovering
    let hoverGeo = new TextGeometry(contexts[0]['text'], {
        font: font,
        size: .6,
        depth: .3,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: .05,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5
    })
    let hover = new THREE.Mesh(hoverGeo, matcapMat)
    hover.name = 'firstText'
    hoverGeo.computeBoundingBox()
    hoverGeo.center()
    texts.push({
        index: 0,
        geo: hover
    })

    hoverGeo = new TextGeometry(contexts[1]['text'], {
        font: font,
        size: .6,
        depth: .3,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: .05,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5
    })
    hover = new THREE.Mesh(hoverGeo, matcapMat)
    hover.name = 'secondText'
    hoverGeo.computeBoundingBox()
    hoverGeo.center()
    texts.push({
        index: 0,
        geo: hover
    })

    hoverGeo = new TextGeometry(contexts[2]['text'], {
        font: font,
        size: .6,
        depth: .3,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: .05,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5
    })
    hover = new THREE.Mesh(hoverGeo, matcapMat)
    hover.name = 'thirdText'
    hoverGeo.computeBoundingBox()
    hoverGeo.center()
    texts.push({
        index: 0,
        geo: hover
    })

    hoverGeo = new TextGeometry(contexts[3]['text'], {
        font: font,
        size: .6,
        depth: .3,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: .05,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5
    })
    hover = new THREE.Mesh(hoverGeo, matcapMat)
    hover.name = 'fourthText'
    hoverGeo.computeBoundingBox()
    hoverGeo.center()
    texts.push({
        index: 0,
        geo: hover
    })

    hoverGeo = new TextGeometry(contexts[4]['text'], {
        font: font,
        size: .6,
        depth: .3,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: .05,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5
    })
    hover = new THREE.Mesh(hoverGeo, matcapMat)
    hover.name = 'fifthText'
    hoverGeo.computeBoundingBox()
    hoverGeo.center()
    texts.push({
        index: 0,
        geo: hover
    })
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

// File model
let fileModels = []
gltfLoader.load(
    '/models/file.glb',
    (gltf) => {
        let mesh = null // Tmp mesh 
        gltf.scene.traverse((mesh) => {
            mesh.material = matcapMat
        })
        gltf.scene.translateY(7)
        gltf.scene.scale.set(2, 2, 2)
        // First file
        mesh = gltf.scene.clone()
        mesh.translateX(-7)
        fileModels.push(mesh)
        scene.add(fileModels[0])
        // Second file
        mesh = gltf.scene.clone()
        fileModels.push(mesh)
        scene.add(fileModels[1])
        // Third file 
        mesh = gltf.scene.clone()
        mesh.translateX(7)
        fileModels.push(mesh)
        scene.add(fileModels[2])
        // Fourth file 
        mesh = gltf.scene.clone()
        mesh.translateX(-14)
        fileModels.push(mesh)
        scene.add(fileModels[3])
        // Fifth file 
        mesh = gltf.scene.clone()
        mesh.translateX(14)
        fileModels.push(mesh)
        scene.add(fileModels[4])
    }
)

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

// Intersection
let currentIntersect = null

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

    raycaster.setFromCamera(mouse, camera)
    // Make the files look at you and grow if you hover them
    if(fileModels){
        let i = 0
        // Raycaster 
        fileModels.forEach(m => {
            m.lookAt(camera.position)
            // Checking if the object is hovered 
            const intersect = raycaster.intersectObject(m)
            if (intersect.length){ // If hovered, scale up the object and display the text
                m.scale.set(2.5, 2.5, 2.5)
                switch (i) {
                    case 0:
                        if (!scene.getObjectByName('firstText')){
                            scene.add(texts[i].geo)
                            texts[i].geo.position.copy(m.position)
                            texts[i].geo.translateY(4)
                        }
                        break;
                    case 1 :
                        if (!scene.getObjectByName('secondText')){
                            scene.add(texts[i].geo)
                            texts[i].geo.position.copy(m.position)
                            texts[i].geo.translateY(4)
                        }
                        break;
                    case 2 :
                        if (!scene.getObjectByName('thirdText')){
                            scene.add(texts[i].geo)
                            texts[i].geo.position.copy(m.position)
                            texts[i].geo.translateY(4)
                        }
                        break;
                    case 3 :
                        if (!scene.getObjectByName('fourthText')){
                            scene.add(texts[i].geo)
                            texts[i].geo.position.copy(m.position)
                            texts[i].geo.translateY(4)
                        }
                        break;
                    case 4 :
                        if (!scene.getObjectByName('fifthText')){
                            scene.add(texts[i].geo)
                            texts[i].geo.position.copy(m.position)
                            texts[i].geo.translateY(4)
                        }
                        break;
                }
            } else {
                m.scale.set(2, 2, 2)
                scene.remove(texts[i].geo)
            }
            i++
        });
        
    }

    // Getting the objects hovered for click event
    const interObj = []
    if(fileModels){
        let i = 0
        fileModels.forEach(m => {
            const intersect = raycaster.intersectObject(m)
            if(intersect.length){
                interObj.push({
                    mesh: m,
                    index: i
                })
            }
            i++
        })
    }

    if (interObj.length){
        currentIntersect = interObj
    } else {
        currentIntersect = null
    }

    // Updating the controls
    controls.update()

    // update the renderer
    renderer.render(scene, camera)

    // Call next frame
    window.requestAnimationFrame(tick)
}

tick()