import Grainient from './Grainient';

const AuthLayout = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-6 md:p-10 bg-background text-foreground">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      {/* Shadcn Card */}
      <div className="relative z-10 w-full max-w-sm bg-card border border-border shadow-lg shadow-black/20 rounded-xl p-8 text-card-foreground">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
