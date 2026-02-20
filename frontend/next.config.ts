import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Next.js 16에서는 devIndicators를 false로 설정하면 모든 개발 인디케이터(Static Route 등)를 끌 수 있습니다.
  devIndicators: false,
  // 로컬 네트워크(IP) 접속 시 발생하는 Cross Origin 경고를 방지합니다.
  allowedDevOrigins: ['localhost:3000'],
  experimental: {
  },
};

export default nextConfig;
