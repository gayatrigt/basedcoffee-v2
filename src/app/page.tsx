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
        src="/mixkit-a-man-sitting-beneath-laser-lights-in-cyberpunk-glasses-50461-full-hd.mp4" />
      <div className="container flex flex-col gap-2 p-8 text-white z-10 bg-white/10 border-t-2 border-white/10 pt-12">
        <h1 className=" font-accent uppercase text-2xl">Based<br />Backers</h1>
        <p className="mb-4">A place for builder, creators and innvators to grow and support</p>

        <LoginButton />
      </div>

    </main>
  );
}
