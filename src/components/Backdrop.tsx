export function Backdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="tmt-grid absolute inset-0 opacity-[0.35]" />
      <div className="absolute -top-32 left-1/2 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(30,136,229,0.12),transparent_65%)] blur-3xl" />
      <div className="absolute bottom-0 right-0 h-[320px] w-[480px] rounded-full bg-[radial-gradient(circle_at_center,rgba(0,230,118,0.06),transparent_70%)] blur-3xl" />
    </div>
  );
}
