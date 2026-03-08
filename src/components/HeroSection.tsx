interface HeroSectionProps {
  mode: "expert" | "eli5";
  onModeChange: (mode: "expert" | "eli5") => void;
}

const HeroSection = ({ mode, onModeChange }: HeroSectionProps) => {
  return (
    <section className="text-center pt-10 md:pt-16 pb-8">
      <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-foreground">
        Drop a Paper.{" "}
        <span className="gradient-text">Get Clarity.</span>
      </h1>
      <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
        Paste an abstract or upload a PDF and get a structured breakdown instantly
      </p>
      <div className="relative flex items-center justify-center gap-1 mt-8 bg-secondary rounded-full p-1 w-fit mx-auto">
        {/* Sliding background */}
        <div
          className="absolute top-1 bottom-1 rounded-full gradient-primary shadow-lg shadow-primary/25 transition-all duration-300 ease-in-out"
          style={{
            left: mode === "expert" ? "4px" : "50%",
            right: mode === "eli5" ? "4px" : "50%",
          }}
        />
        <button
          onClick={() => onModeChange("expert")}
          className={`relative z-10 px-5 py-2.5 rounded-full text-sm font-semibold transition-colors duration-200 ${
            mode === "expert"
              ? "text-primary-foreground"
              : "text-secondary-foreground hover:text-foreground"
          }`}
        >
          🎓 Expert Mode
        </button>
        <button
          onClick={() => onModeChange("eli5")}
          className={`relative z-10 px-5 py-2.5 rounded-full text-sm font-semibold transition-colors duration-200 ${
            mode === "eli5"
              ? "text-primary-foreground"
              : "text-secondary-foreground hover:text-foreground"
          }`}
        >
          🧒 ELI5 Mode
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
