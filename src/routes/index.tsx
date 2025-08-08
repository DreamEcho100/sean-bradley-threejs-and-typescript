import { A } from "@solidjs/router";
import { For } from "solid-js";

const lessons = [
  {
    children: "Lesson 1 - Starter",
    href: "./lessons/1-starter",
    references: [
      {
        href: "https://sbcode.net/threejs/",
        children: "Three.js Tutorial",
      },
      {
        href: "https://sbcode.net/threejs/introduction/",
        children: "Introduction - Three.js Tutorial",
      },
      {
        href: "https://sbcode.net/threejs/setup-dev/",
        children: "Setup Development Environment - Three.js Tutorial",
      },
      {
        href: "https://sbcode.net/threejs//install-threejs-and-types/",
        children: "Install Three.js and @three/types - Three.js Tutorial",
      },
      {
        href: "https://sbcode.net/threejs/importing-threejs-modules/",
        children: "Importing Three.js Modules - Three.js Tutorial",
      },
      {
        href: "https://sbcode.net/threejs/stats-panel-module/",
        children: "Stats Panel - Three.js Tutorial",
      },
      {
        href: "https://sbcode.net/threejs/dat-gui-module/",
        children: "Dat GUI - Three.js Tutorial",
      },
      {
        href: "https://sbcode.net/threejs/threejs-boilerplate-typescript-vite/",
        children: "Install Three.js Course Boilerplate - Three.js Tutorial",
      },
      {
        href: "https://sbcode.net/threejs/renderer/",
        children: "Renderer - Three.js Tutorial",
      },
      {
        href: "https://fennec-hub.github.io/three-viewport-gizmo/",
        children: "Three Viewport Gizmo - Docs",
      },
    ],
  },
  {
    children: "Lesson 2 - Scene",
    href: "./lessons/2-scene",
    references: [
      {
        href: "https://sbcode.net/threejs/scene/",
        children: "Scene - Three.js Tutorial",
      },
    ],
  },
  {
    children: "Lesson 3 - Camera",
    href: "./lessons/3-camera",
    references: [
      {
        href: "https://sbcode.net/threejs/camera/",
        children: "Camera - Three.js Tutorial",
      },
    ],
  },
  {
    children: "Lesson 4 - Animation Loop",
    href: "./lessons/4-animation-loop",
    references: [
      {
        href: "https://sbcode.net/threejs/render-loop/",
        children: "Animation Loop - Three.js Tutorial",
      },
    ],
  },
  {
    children: "Lesson 5 - Object3D",
    href: "./lessons/5-object3d",
    references: [
      {
        href: "https://sbcode.net/threejs/three-object3d/",
        children: "Object3D - Three.js Tutorial",
      },
      {
        href: "https://sbcode.net/threejs/three-object3d-hierarchy/",
        children: "Object3D Hierarchy - Three.js Tutorial",
      },
    ],
  },
];

export default function Home() {
  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">
        Three.js and TypeScript Udemy course by Sean Bradley
      </h1>
      <p>Lessons</p>
      <ul>
        <For each={lessons}>
          {(lesson) => (
            <li class="my-4">
              <A href={lesson.href} class="text-sky-600 hover:underline">
                {lesson.children}
              </A>
            </li>
          )}
        </For>
      </ul>
    </main>
  );
}
