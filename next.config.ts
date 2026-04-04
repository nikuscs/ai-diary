import type { NextConfig } from "next";

const isStaticExport = process.env.STATIC_EXPORT === "true";

const nextConfig: NextConfig = {
  ...(isStaticExport && { output: "export" }),
  images: { unoptimized: isStaticExport },
  env: {
    NEXT_PUBLIC_IS_STATIC: String(isStaticExport),
  },
  ...(!isStaticExport && {
    rewrites: async () => [
      { source: "/images/:id.png", destination: "/api/image?id=:id" },
    ],
  }),
};

export default nextConfig;
