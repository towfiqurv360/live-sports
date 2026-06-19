/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning-এর জন্য যেন বিল্ড ফেইল না করে, তার পারমিশন
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;