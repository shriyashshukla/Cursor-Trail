import CursorTrail from "@/components/CursorTrail";

export default function Home() {
  return (
    <main className="w-full h-screen bg-black overflow-hidden">
      <CursorTrail />

      <div className="flex items-center justify-center h-full">
        <h1 className="text-white text-5xl font-bold">
          Cursor Trail Effect
        </h1>
      </div>
    </main>
  );
}