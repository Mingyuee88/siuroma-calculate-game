/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ 忽略 ESLint 错误以防止构建失败
  },
  // 其他配置项可以继续添加在下面
};

module.exports = nextConfig;
