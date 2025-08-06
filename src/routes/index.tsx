import { A } from "@solidjs/router";

export default function Home() {
  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">
        Three.js and TypeScript Udemy course by Sean Bradley
      </h1>
      <p>Lessons</p>
      <ul>
        <li class="my-4">
          <A href="./lessons/1-starter" class="text-sky-600 hover:underline">
            Lesson 1 - Starter
          </A>
        </li>
        <li class="my-4">
          <A href="./lessons/2-scene" class="text-sky-600 hover:underline">
            Lesson 2 - Scene
          </A>
        </li>
      </ul>
    </main>
  );
}
