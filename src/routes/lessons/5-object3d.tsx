import GUI from "lil-gui";
import { onCleanup, onMount } from "solid-js";
import * as THREE from "three";
import { ViewportGizmo } from "three-viewport-gizmo";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import Stats from "three/examples/jsm/libs/stats.module.js";

function addObjectToGui(props: {
  object: THREE.Object3D;
  name: string;
  gui: GUI;
}) {
  const cubeFolder = props.gui.addFolder(props.name);
  cubeFolder.add(props.object, "visible");
  cubeFolder.open();

  const positionFolder = cubeFolder.addFolder("Position");
  positionFolder.add(props.object.position, "x", -10, 10);
  positionFolder.add(props.object.position, "y", -10, 10);
  positionFolder.add(props.object.position, "z", -10, 10);
  positionFolder.close();

  const rotationFolder = cubeFolder.addFolder("Rotation");
  rotationFolder.add(props.object.rotation, "x", 0, Math.PI * 2);
  rotationFolder.add(props.object.rotation, "y", 0, Math.PI * 2);
  rotationFolder.add(props.object.rotation, "z", 0, Math.PI * 2);
  rotationFolder.close();

  const scaleFolder = cubeFolder.addFolder("Scale");
  scaleFolder.add(props.object.scale, "x", -5, 5);
  scaleFolder.add(props.object.scale, "y", -5, 5);
  scaleFolder.add(props.object.scale, "z", -5, 5);
  scaleFolder.close();
}

export default function Object3dLesson() {
  let mainContainerRef: HTMLDivElement | undefined;
  let canvasRef: HTMLCanvasElement | undefined;
  let endSideMenuContainerRef: HTMLDivElement | undefined;
  let startSideMenuContainerRef: HTMLDivElement | undefined;

  onMount(() => {
    if (
      !mainContainerRef ||
      !canvasRef ||
      !startSideMenuContainerRef ||
      !endSideMenuContainerRef
    )
      return;

    const cleanupManager = new CleanupManager();
    const addCleanup = cleanupManager.add;
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

    const scene = new THREE.Scene();
    /** @cleanup */ addCleanup(() => scene.clear());

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(4, 4, 4);

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef });
    /** @cleanup */ addCleanup(renderer.dispose);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(config.canvas.width, config.canvas.height);
    renderer.domElement.style.setProperty("max-width", "100%");
    mainContainerRef.appendChild(renderer.domElement);
    /** @cleanup */ addCleanup(() => {
      mainContainerRef.removeChild(renderer.domElement);
    });

    const { stats } = setupStartSideMenu({
      container: startSideMenuContainerRef,
      addCleanup,
    });
    const debug = document.createElement("pre");
    debug.className = "monospace text-xs text-white pointer-events-none";
    startSideMenuContainerRef.appendChild(debug);
    /** @cleanup */ addCleanup(() => {
      debug.parentElement?.removeChild(debug);
    });

    const orbitControls = new OrbitControls(camera, renderer.domElement);
    /** @cleanup */ addCleanup(() => {
      orbitControls.dispose();
    });
    orbitControls.target.set(8, 0, 0);
    orbitControls.update();

    const { gizmo, gui } = setupEndSideMenu({
      container: endSideMenuContainerRef,
      addCleanup,
      orbitControls,
      camera,
      renderer,
    });

    const resizeHandler = () => {
      config.canvas.updateSize();
      camera.aspect = config.canvas.aspect;
      camera.updateProjectionMatrix();
      renderer.setSize(config.canvas.width, config.canvas.height);
      gizmo.update();
    };
    window.addEventListener("resize", resizeHandler);
    /** @cleanup */ addCleanup(() => {
      window.removeEventListener("resize", resizeHandler);
    });

    const light = new THREE.PointLight(0xffffff, 400);
    light.position.set(10, 10, 10);
    scene.add(light);

    const object1 = new THREE.Mesh(
      new THREE.SphereGeometry(),
      new THREE.MeshPhongMaterial({ color: 0xff0000 })
    );
    scene.add(object1);
    object1.position.set(4, 0, 0);
    object1.add(new THREE.AxesHelper(5));
    addObjectToGui({ object: object1, name: "Object 1 (Red Ball)", gui });

    const object2 = new THREE.Mesh(
      new THREE.SphereGeometry(),
      new THREE.MeshPhongMaterial({ color: 0x00ff00 })
    );
    object1.add(object2);
    object2.position.set(4, 0, 0);
    object2.add(new THREE.AxesHelper(5));
    addObjectToGui({ object: object2, name: "Object 2 (Green Ball)", gui });

    const object3 = new THREE.Mesh(
      new THREE.SphereGeometry(),
      new THREE.MeshPhongMaterial({ color: 0x0000ff })
    );
    object2.add(object3);
    object3.position.set(4, 0, 0);
    object3.add(new THREE.AxesHelper(5));
    addObjectToGui({ object: object3, name: "Object 3 (Blue Ball)", gui });

    let animateId: number | undefined;

    function animate() {
      animateId = requestAnimationFrame(animate);

      const object1WorldPosition = new THREE.Vector3();
      object1.getWorldPosition(object1WorldPosition);
      const object2WorldPosition = new THREE.Vector3();
      object2.getWorldPosition(object2WorldPosition);
      const object3WorldPosition = new THREE.Vector3();
      object3.getWorldPosition(object3WorldPosition);

      debug.innerText =
        "Red\n" +
        "Local Pos X : " +
        object1.position.x.toFixed(2) +
        "\n" +
        "World Pos X : " +
        object1WorldPosition.x.toFixed(2) +
        "\n" +
        "\nGreen\n" +
        "Local Pos X : " +
        object2.position.x.toFixed(2) +
        "\n" +
        "World Pos X : " +
        object2WorldPosition.x.toFixed(2) +
        "\n" +
        "\nBlue\n" +
        "Local Pos X : " +
        object3.position.x.toFixed(2) +
        "\n" +
        "World Pos X : " +
        object3WorldPosition.x.toFixed(2) +
        "\n";

      renderer.render(scene, camera);
      gizmo.render();
      stats.update();
    }

    animate();
    /** @cleanup */ addCleanup(() => {
      if (!animateId) return;

      cancelAnimationFrame(animateId);
    });

    onCleanup(cleanupManager.run);
  });

  return (
    <div class="max-w-screen relative" ref={mainContainerRef}>
      <div
        class="absolute top-0 right-0 flex flex-col gap-4 items-end p-4"
        ref={endSideMenuContainerRef}
      />
      <div
        class="absolute top-0 left-0 flex flex-col gap-4 items-start p-4"
        ref={startSideMenuContainerRef}
      />
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}

class CleanupManager {
  private cleanupFns: (() => void)[] = [];
  constructor() {
    this.cleanupFns = [];
    this.add = this.add.bind(this);
    this.run = this.run.bind(this);
  }
  add(fn: () => void) {
    this.cleanupFns.push(fn);
  }
  run() {
    this.cleanupFns.forEach((fn) => fn());
    this.cleanupFns = [];
  }
}

function setupStartSideMenu(props: {
  container: HTMLDivElement;
  addCleanup: (fn: () => void) => void;
}) {
  const stats = new Stats();
  ["position", "top", "left", "z-index"].forEach((prop) =>
    stats.dom.style.removeProperty(prop)
  );
  props.container.appendChild(stats.dom);
  props.addCleanup(() => props.container.removeChild(stats.dom));

  return { stats };
}

function setupEndSideMenu(props: {
  container: HTMLDivElement;
  addCleanup: (fn: () => void) => void;
  orbitControls: OrbitControls;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
}) {
  const gizmo = new ViewportGizmo(props.camera, props.renderer, {
    className: "responsive-gizmo w-auto h-1/2 aspect-square",
    container: props.container,
    // .responsive-gizmo {
    //   width: auto !important;
    //   height: 50% !important;
    //   aspect-ratio: 1;
    // }
  });
  gizmo.attachControls(props.orbitControls);
  const gizmoElement = document.querySelector(
    ".responsive-gizmo"
  ) as HTMLElement | null;
  if (!gizmoElement) {
    throw new Error("Gizmo element not found.");
  }
  ["top", "right", "position", "z-index", "margin"].forEach((prop) => {
    gizmoElement.style.removeProperty(prop);
  });
  gizmo.update();

  const gui = new GUI({ container: props.container });
  /** @cleanup */ props.addCleanup(() => gui.destroy());

  return { gizmo, gui };
}
