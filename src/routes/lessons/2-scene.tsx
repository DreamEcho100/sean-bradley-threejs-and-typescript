import GUI from "lil-gui";
import { onCleanup, onMount } from "solid-js";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import Stats from "three/examples/jsm/libs/stats.module.js";

export default function SceneLesson() {
  let ref: HTMLDivElement | undefined;

  onMount(() => {
    if (!ref) return;
    const cleanupArr: (() => void)[] = [];
    const container = ref;

    const mainNav = document.getElementById("main-nav");
    if (!mainNav) {
      console.error("Main navigation element not found.");
      return;
    }
    const topSize = mainNav.offsetHeight + 10;

    const gui = new GUI();
    /** @cleanup */ cleanupArr.push(() => gui.destroy());
    gui.domElement.style.setProperty("top", `${topSize}px`);

    let activeScene: THREE.Scene;

    const sceneA = new THREE.Scene();
    /** @cleanup */ cleanupArr.push(() => sceneA.clear());
    sceneA.background = new THREE.Color(0x123456);

    let sceneB: THREE.Scene | undefined;

    let sceneC: THREE.Scene | undefined;

    activeScene = sceneA;

    const setScene = {
      sceneA: () => {
        activeScene = sceneA;
        activeScene.add(cube);
      },
      sceneB: () => {
        if (!sceneB) {
          sceneB = new THREE.Scene();
          /** @cleanup */ cleanupArr.push(() => sceneB?.clear());
          sceneB.background = new THREE.TextureLoader().load(
            "https://sbcode.net/img/grid.png"
          );
        }
        activeScene = sceneB;
        activeScene.add(cube);
      },
      sceneC: () => {
        if (!sceneC) {
          sceneC = new THREE.Scene();
          /** @cleanup */ cleanupArr.push(() => sceneC?.clear());
          sceneC.background = new THREE.CubeTextureLoader()
            .setPath("https://sbcode.net/img/")
            .load(["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"]);
          //sceneC.backgroundBlurriness = 0.5
        }
        activeScene = sceneC;
        activeScene.add(cube);
      },
    };
    gui.add(setScene, "sceneA").name("Scene A");
    gui.add(setScene, "sceneB").name("Scene B");
    gui.add(setScene, "sceneC").name("Scene C");

    const stats = new Stats();
    document.body.appendChild(stats.dom);
    /* @cleanup */ cleanupArr.push(() => document.body.removeChild(stats.dom));
    stats.dom.style.setProperty("top", `${topSize}px`);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 1.5;

    const config = {
      canvas: {
        width: window.innerWidth,
        height: window.innerHeight,
        aspect: window.innerWidth / window.innerHeight,
        updateSize: () => {
          config.canvas.width = window.innerWidth;
          config.canvas.height = window.innerHeight;
          config.canvas.aspect = window.innerWidth / window.innerHeight;
        },
      },
    };

    const renderer = new THREE.WebGLRenderer();
    /** @cleanup */ cleanupArr.push(renderer.dispose);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(config.canvas.width, config.canvas.height);
    renderer.domElement.style.setProperty("max-width", "100%");
    container.appendChild(renderer.domElement);
    /** @cleanup */ cleanupArr.push(() => {
      container.removeChild(renderer.domElement);
    });

    const resizeHandler = () => {
      config.canvas.updateSize();
      camera.aspect = config.canvas.aspect;
      camera.updateProjectionMatrix();
      renderer.setSize(config.canvas.width, config.canvas.height);
    };
    window.addEventListener("resize", resizeHandler);
    /** @cleanup */ cleanupArr.push(() => {
      window.removeEventListener("resize", resizeHandler);
    });

    const orbitControls = new OrbitControls(camera, renderer.domElement);
    /** @cleanup */ cleanupArr.push(() => {
      orbitControls.dispose();
    });

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshNormalMaterial({ wireframe: true });

    const cube = new THREE.Mesh(geometry, material);
    activeScene.add(cube);

    let animateId: number | undefined;

    function animate() {
      animateId = requestAnimationFrame(animate);

      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      renderer.render(activeScene, camera);
      // orbitControls.update();
      stats.update();
    }

    animate();
    /** @cleanup */ cleanupArr.push(() => {
      if (!animateId) return;

      cancelAnimationFrame(animateId);
    });

    onCleanup(() => {
      cleanupArr.forEach((cleanup) => {
        cleanup();
      });
    });
  });

  return (
    <div class="text-center mx-auto text-gray-700 max-w-screen" ref={ref}></div>
  );
}
