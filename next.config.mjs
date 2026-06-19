import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Turbopack এর সাথে Webpack-এর সংঘর্ষ এড়ানোর জন্য
  turbopack: {},
};

export default withPWA(nextConfig);