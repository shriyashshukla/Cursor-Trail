import CursorTrail from "@/components/CursorTrail";

export default function Home() {
  return (
    <main className="relative w-full min-h-screen overflow-x-hidden bg-black">
      <section id="first-section" className="h-screen relative overflow-hidden">
        <CursorTrail targetId="first-section" />

        <div className="flex items-center justify-center h-full">
          <h1 className="z-10 text-white text-6xl font-bold">
            Motion Cursor Trail
          </h1>
        </div>
      </section>

      <section className="h-screen bg-white"></section>
    </main>
  );
}
