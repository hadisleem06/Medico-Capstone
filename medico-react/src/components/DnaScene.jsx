import { useEffect, useRef } from "react"

import * as THREE from "three"

import { GLTFLoader }
from "three/examples/jsm/loaders/GLTFLoader.js"


/*
    DnaScene — the landing hero's rotating 3D DNA helix.

    A faithful port of the original assets/js/main.js, which ran
    as an ES module on the landing page and rendered a Three.js
    scene into the #scene div. The behaviour is reproduced exactly:

      - PerspectiveCamera(45, 1, 0.1, 100) pulled back to z = 4
      - alpha + antialias renderer, fixed 550x550, device pixel
        ratio, canvas pointer-events disabled so it never eats
        clicks from the hero
      - cyan (#17afa2) + purple (#8b5cf6) point lights + full
        white ambient
      - dna.glb scaled x4, tilted (-10 / 25 / 5 deg), lifted to
        y = 0.3, its baked-in clip played through an AnimationMixer
      - platform.glb dropped to y = -1 and turned 90 deg
      - per-frame: mixer update, slow dna spin (+0.003/f), a gentle
        sine float, and a slow platform spin (+0.005/f)

    The originals loaded models from "./assets/models/*.glb"
    (a path that only resolved from the repo root); here they are
    served from /public/models via BASE_URL, so the scene works
    under any deploy base.

    React specifics the vanilla script did not need: everything is
    created inside a single useEffect so the animation loop and the
    WebGL context are torn down on unmount, and a "disposed" guard
    drops late-arriving GLTF callbacks — this also makes the effect
    safe under StrictMode's double-invoke in development.
*/

const BASE = import.meta.env.BASE_URL


export default function DnaScene() {

    const containerRef = useRef(null)


    useEffect(() => {

        const container = containerRef.current

        if (!container) {
            return
        }


        let disposed = false

        let rafId = 0


        const scene = new THREE.Scene()


        const camera = new THREE.PerspectiveCamera(
            45,
            1,
            0.1,
            100
        )

        camera.position.z = 4


        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
        })

        renderer.setSize(
            550,
            550
        )

        renderer.setPixelRatio(
            window.devicePixelRatio
        )

        renderer.domElement.style.pointerEvents = "none"

        container.appendChild(renderer.domElement)


        // LIGHTS

        const cyanLight = new THREE.PointLight(
            0x17afa2,
            8,
            10
        )

        cyanLight.position.set(
            3,
            3,
            3
        )

        scene.add(cyanLight)


        const purpleLight = new THREE.PointLight(
            0x8b5cf6,
            5,
            10
        )

        purpleLight.position.set(
            -3,
            2,
            2
        )

        scene.add(purpleLight)


        scene.add(
            new THREE.AmbientLight(
                0xffffff,
                1
            )
        )


        // MODELS

        const loader = new GLTFLoader()

        let dna
        let platform
        let mixer

        const clock = new THREE.Clock()


        loader.load(
            BASE + "models/dna.glb",
            function (gltf) {

                if (disposed) {
                    return
                }

                dna = gltf.scene

                dna.scale.set(
                    4,
                    4,
                    4
                )

                dna.rotation.z = THREE.MathUtils.degToRad(-10)
                dna.rotation.x = THREE.MathUtils.degToRad(25)
                dna.rotation.y = THREE.MathUtils.degToRad(5)

                scene.add(dna)

                dna.position.y = 0.3


                // PLAY DNA ANIMATION

                if (gltf.animations.length > 0) {

                    mixer = new THREE.AnimationMixer(dna)

                    mixer
                        .clipAction(gltf.animations[0])
                        .play()

                }

            },
            undefined,
            function (error) {
                console.error(
                    "DNA MODEL ERROR:",
                    error
                )
            }
        )


        loader.load(
            BASE + "models/platform.glb",
            function (gltf) {

                if (disposed) {
                    return
                }

                platform = gltf.scene

                platform.scale.set(
                    1,
                    1,
                    1
                )

                platform.position.set(
                    0,
                    -1,
                    0
                )

                platform.rotation.y = Math.PI / 2

                scene.add(platform)

            },
            undefined,
            function (error) {
                console.error(
                    "PLATFORM ERROR:",
                    error
                )
            }
        )


        function animate() {

            rafId = requestAnimationFrame(animate)

            const delta = clock.getDelta()


            if (mixer) {
                mixer.update(delta)
            }


            if (dna) {

                // slow rotation
                dna.rotation.y += 0.003

                // floating movement
                dna.position.y = Math.sin(Date.now() * 0.002) * 0.08

            }


            if (platform) {
                platform.rotation.y += 0.005
            }


            renderer.render(
                scene,
                camera
            )

        }

        animate()


        return () => {

            disposed = true

            cancelAnimationFrame(rafId)


            if (mixer) {
                mixer.stopAllAction()
            }


            renderer.dispose()


            if (renderer.domElement.parentNode === container) {
                container.removeChild(renderer.domElement)
            }

        }

    }, [])


    return (
        <div
            id="scene"
            ref={containerRef}
        ></div>
    )

}
