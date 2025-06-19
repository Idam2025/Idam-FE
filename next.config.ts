import type { Configuration } from "webpack";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config: Configuration) {
    if (!config.module) {
      config.module = { rules: [] };
    }

    if (!config.module.rules) {
      config.module.rules = [];
    }

    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "unithon-idam.s3.ap-northeast-2.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
