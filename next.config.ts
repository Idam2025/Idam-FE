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

    // 여기까지 왔다면 config.module.rules는 확실히 존재함
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
  images: {
    domains: ["unithon-idam.s3.ap-northeast-2.amazonaws.com"],
  },
};

export default nextConfig;
