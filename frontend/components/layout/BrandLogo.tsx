import Image from "next/image";

export function BrandLogo({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizes = {
    sm: { px: 36, className: "h-9 w-9" },
    md: { px: 44, className: "h-11 w-11" },
    lg: { px: 48, className: "h-12 w-12" },
  }[size];

  return (
    <Image
      src="/eme-logo.png"
      alt="NUST CEME Logo"
      width={sizes.px}
      height={sizes.px}
      className={`shrink-0 object-contain ${sizes.className} ${className}`}
      priority
    />
  );
}
