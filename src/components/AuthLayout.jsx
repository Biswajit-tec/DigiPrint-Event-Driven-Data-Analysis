import DarkVeil from './ui/DarkVeil';

const AuthLayout = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-6 md:p-10 bg-background text-foreground">
      {/* DarkVeil WebGL Background */}
      <div className="absolute inset-0 z-0">
        <DarkVeil
          hueShift={0}
          noiseIntensity={0}
          scanlineIntensity={0}
          speed={0.5}
          scanlineFrequency={0}
          warpAmount={0}
        />
        <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px]"></div>
      </div>

      {/* Shadcn Card */}
      <div className="relative z-10 w-full max-w-sm bg-card border border-border shadow-lg shadow-black/20 rounded-xl p-8 text-card-foreground">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
