type LiquidLoaderProps = {
  label?: string;
  size?: "sm" | "md" | "lg";
};

export function LiquidLoader({ label = "Loading", size = "md" }: LiquidLoaderProps) {
  return (
    <span className={`liquid-loader liquid-loader-${size}`} role="status" aria-label={label}>
      <span className="liquid-loader-wave" />
      <span className="liquid-loader-shine" />
    </span>
  );
}
