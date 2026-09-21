export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background gradient */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-purple-500/15 rounded-full blur-3xl animate-float" />
      </div>

      <div className="w-full max-w-md px-6">{children}</div>
    </div>
  );
}