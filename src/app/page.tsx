import HomepageCta from "~/components/HomepageCta";

export default function HomePage() {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-end bg-slate-900 relative">
      <video
        className="w-full h-full object-cover absolute top-0 left-0 bg-white/10 blur-sm"
        loop
        muted
        autoPlay
        playsInline
        src="https://cdn.openai.com/ctf-cdn/paper-planes.mp4"
      />
      <div className="container p-2 z-10">
        <div
          //  className=" text-white bg-white/10 border-2 border-white/40 p-4 flex flex-col gap-2 pt-8 rounded-lg"
          className=" text-white bg-slate-900/70 backdrop-blur-md border-2 border-slate-100/20 p-4 flex flex-col gap-2 pt-8 rounded-lg"
        >
          <h3 className="font-bold text-lg"> BasedCoffee </h3>
          <h1 className="font-accent uppercase text-3xl leading-[60px]">Fund Ideas <br />Fuel Creators</h1>
          <p className="mb-2 text-base opacity-80 mt-2">Got a brilliant idea but your pockets are empty? Or want to be part of the next big thing?
            <br /> <br />BasedCoffee is where raw talent meets real support. No gatekeepers, no BS.</p>
          <HomepageCta />
        </div>
      </div>
    </main>
  );
}
