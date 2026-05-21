import CursorTrail from "@/components/CursorTrail";

export default function Home() {
  return (
   
    <main className="relative w-full overflow-hidden bg-black">
      <div className="h-screen">
        <CursorTrail />

        <div className="flex items-center justify-center h-full">
          <h1 className="z-10 text-white text-6xl font-bold">
            Motion Cursor Trail
          </h1>
        </div>
      </div>

      <div className="h-screen bg-white">

      </div>

    </main>
    
  );
}
