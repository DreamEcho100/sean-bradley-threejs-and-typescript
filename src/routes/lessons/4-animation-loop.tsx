import GUI from "lil-gui";
import { onCleanup, onMount } from "solid-js";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import Stats from "three/examples/jsm/libs/stats.module.js";

export default function AnimationLoopLesson() {
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

    const scene = new THREE.Scene();
    /** @cleanup */ cleanupArr.push(() => scene.clear());

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
      renderer.render(scene, camera);
      stats.update();
    };
    window.addEventListener("resize", resizeHandler);
    /** @cleanup */ cleanupArr.push(() => {
      window.removeEventListener("resize", resizeHandler);
    });

    const orbitControls = new OrbitControls(camera, renderer.domElement);
    /** @cleanup */ cleanupArr.push(() => {
      orbitControls.dispose();
    });
    orbitControls.addEventListener("change", () => {
      renderer.render(scene, camera);
      stats.update();
    });

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshNormalMaterial({ wireframe: true });

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    let animateId: number | undefined;

    // The clock is useful for animations and time-based updates.
    // So that it can be dependent from the frame rate.
    // as an example, if you want to rotate the cube at a constant speed, even if the frame rate drops or increases.
    // const clock = new THREE.Clock();

    // Animation loop is sometimes not needed, but it is a common pattern in Three.js.
    // It allows you to create a continuous rendering loop that updates the scene and camera.
    // This is useful for animations, user interactions, and other dynamic updates.
    // It's not strictly necessary for static scenes or simple applications where you only render once or on specific events.
    // However, for interactive applications or animations, using an animation loop is a good practice.
    // The animation loop is typically set up using requestAnimationFrame, which calls the animate function
    // before the next repaint of the browser, ensuring smooth animations and updates.
    // And you can use cancelAnimationFrame to stop the loop when it's no longer needed.
    // And you can use the clock to get the time elapsed since the last frame, to create time-based animations and consistent updates between frames.
    function animate() {
      animateId = requestAnimationFrame(animate);

      // const delta = clock.getDelta();

      // cube.rotation.x += delta;
      // cube.rotation.y += delta;

      // renderer.render(scene, camera);
      // orbitControls.update();
      stats.update();
    }

    animate();
    /** @cleanup */ cleanupArr.push(() => {
      if (!animateId) return;

      cancelAnimationFrame(animateId);
    });

    renderer.render(scene, camera);
    stats.update();

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
