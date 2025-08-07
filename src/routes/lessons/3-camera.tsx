import GUI from "lil-gui";
import { onCleanup, onMount } from "solid-js";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import Stats from "three/examples/jsm/libs/stats.module.js";

export default function CameraLesson() {
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
    scene.add(new THREE.GridHelper());

    const stats = new Stats();
    document.body.appendChild(stats.dom);
    /* @cleanup */ cleanupArr.push(() => document.body.removeChild(stats.dom));
    stats.dom.style.setProperty("top", `${topSize}px`);

    const constants = {
      PERSPECTIVE: "Perspective" as const,
      ORTHOGRAPHIC: "Orthographic" as const,
    };

    type CameraType =
      | typeof constants.PERSPECTIVE
      | typeof constants.ORTHOGRAPHIC;

    let currentActiveCameraType: CameraType = constants.PERSPECTIVE;
    const camerasCache: Record<
      string,
      {
        camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
        type: CameraType;
        cleanup: () => void;
        folder: GUI;
      }
    > = {};
    let orbitControls: OrbitControls;
    const renderer = new THREE.WebGLRenderer();
    /** @cleanup */ cleanupArr.push(renderer.dispose);

    function generateCamera(type: CameraType) {
      currentActiveCameraType = type;

      // if (camerasCache[type]) {
      //   const cachedCamera = camerasCache[type];

      //   return camera_
      // }

      let camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
      let resizeHandler: () => void;
      let cameraFolder: GUI;
      if (type === constants.PERSPECTIVE) {
        const _camera = new THREE.PerspectiveCamera(
          75,
          window.innerWidth / window.innerHeight,
          0.1,
          1000
        );
        camera = _camera;
        camera.lookAt(0, 0.5, 0);
        camera.position.set(1, 1, 5);

        resizeHandler = () => {
          config.canvas.updateSize();
          _camera.aspect = config.canvas.aspect;
          _camera.updateProjectionMatrix();
          renderer.setSize(config.canvas.width, config.canvas.height);
        };
        // /** @cleanup */ cleanupArr.push(() => {
        //   window.removeEventListener("resize", resizeHandler);
        // });
        cameraFolder = gui.addFolder("Perspective Camera");
        cameraFolder.add(_camera, "aspect", 0.00001, 10).onChange(() => {
          _camera.updateProjectionMatrix();
        });
        cameraFolder.add(_camera, "fov", 1, 180).onChange(() => {
          _camera.updateProjectionMatrix();
        });
        cameraFolder.add(_camera, "near", 0.01, 10).onChange(() => {
          _camera.updateProjectionMatrix();
        });
        cameraFolder.add(_camera, "far", 0.01, 100).onChange(() => {
          _camera.updateProjectionMatrix();
        });
        cameraFolder.add(_camera.position, "x", -10, 10).onChange(() => {
          _camera.updateProjectionMatrix();
        });
        cameraFolder.add(_camera.position, "y", -10, 10).onChange(() => {
          _camera.updateProjectionMatrix();
        });
        cameraFolder.add(_camera.position, "z", -10, 10).onChange(() => {
          _camera.updateProjectionMatrix();
        });
        cameraFolder.open();
      } else {
        const camera_ = new THREE.OrthographicCamera(-4, 4, 4, -4, -5, 10);
        camera = camera_;
        camera.lookAt(0, 0.5, 0);
        camera.position.set(1, 0.5, 1);
        resizeHandler = () => {
          config.canvas.updateSize();
          camera_.left = -config.canvas.aspect;
          camera_.right = config.canvas.aspect;
          camera_.top = 1;
          camera_.bottom = -1;
          camera_.updateProjectionMatrix();
          renderer.setSize(config.canvas.width, config.canvas.height);
        };
        cameraFolder = gui.addFolder("Orthographic Camera");
        cameraFolder.add(camera_, "left", -10, 10).onChange(() => {
          camera_.updateProjectionMatrix();
        });
        cameraFolder.add(camera_, "right", -10, 10).onChange(() => {
          camera_.updateProjectionMatrix();
        });
        cameraFolder.add(camera_, "top", -10, 10).onChange(() => {
          camera_.updateProjectionMatrix();
        });
        cameraFolder.add(camera_, "bottom", -10, 10).onChange(() => {
          camera_.updateProjectionMatrix();
        });
        cameraFolder.add(camera_, "near", 0.01, 100).onChange(() => {
          camera_.updateProjectionMatrix();
        });
        cameraFolder.add(camera_, "far", 0.01, 1000).onChange(() => {
          camera_.updateProjectionMatrix();
        });
        cameraFolder.add(camera_.position, "x", -10, 10).onChange(() => {
          camera_.updateProjectionMatrix();
        });
        cameraFolder.add(camera_.position, "y", -10, 10).onChange(() => {
          camera_.updateProjectionMatrix();
        });
        cameraFolder.add(camera_.position, "z", -10, 10).onChange(() => {
          camera_.updateProjectionMatrix();
        });
        cameraFolder.open();
      }
      window.addEventListener("resize", resizeHandler);

      camera.updateProjectionMatrix();

      orbitControls = new OrbitControls(camera, renderer.domElement);
      camerasCache[type] = {
        camera,
        type,
        cleanup: () => {
          scene.remove(camera);
          camera.clear();
          window.addEventListener("resize", resizeHandler);
          window.removeEventListener("resize", resizeHandler);
          cameraFolder.destroy();
          orbitControls.dispose();
        },
        folder: cameraFolder,
      };

      return { camera, orbitControls };
    }
    const result = generateCamera(constants.ORTHOGRAPHIC);
    let activeCamera = result.camera;
    orbitControls = result.orbitControls;
    scene.add(activeCamera);
    /* @cleanup */ cleanupArr.push(() => {
      for (const key in camerasCache) {
        camerasCache[key].cleanup();
        camerasCache[key] = null as any;
      }
    });

    const cameraSelector = gui.add(
      { camera: constants.PERSPECTIVE },
      "camera",
      [constants.PERSPECTIVE, constants.ORTHOGRAPHIC]
    );
    cameraSelector.onChange((value: string) => {
      if (activeCamera) {
        camerasCache[currentActiveCameraType].cleanup();
      }

      const result = generateCamera(value as CameraType);
      activeCamera = result.camera;
      orbitControls = result.orbitControls;
      scene.add(activeCamera);
    });

    // generateCamera(constants.PERSPECTIVE);

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

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(config.canvas.width, config.canvas.height);
    renderer.domElement.style.setProperty("max-width", "100%");
    container.appendChild(renderer.domElement);
    /** @cleanup */ cleanupArr.push(() => {
      container.removeChild(renderer.domElement);
    });

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshNormalMaterial({ wireframe: true });

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    cube.position.y = 0.5;

    let animateId: number | undefined;

    function animate() {
      animateId = requestAnimationFrame(animate);

      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      renderer.render(scene, activeCamera);
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
