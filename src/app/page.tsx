import Link from "next/link";
import { motion } from "framer-motion";
import LoginButton from "~/components/LoginButton";

export default function HomePage() {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-end bg-slate-900 relative">
      <video
        className="w-full h-full object-cover absolute top-0 left-0 bg-white/10 blur-sm"
        loop
        muted
        autoPlay
        playsInline
        src="/mixkit-a-man-sitting-beneath-laser-lights-in-cyberpunk-glasses-50461-full-hd.mp4"
      />
      <div className="container p-2 z-10">
        <div
          //  className=" text-white bg-white/10 border-2 border-white/40 p-4 flex flex-col gap-2 pt-8 rounded-lg"
          className=" text-white bg-slate-900/30 backdrop-blur-md border-2 border-slate-100/20 p-4 flex flex-col gap-2 pt-8 rounded-lg"
        >
          <h1 className=" font-accent uppercase text-2xl">Based<br />Backers</h1>
          <p className="mb-2 text-sm opacity-80">A place for builder, creators and innvators to grow and support</p>
          <LoginButton />
        </div>
      </div>

    </main>
  );
}
