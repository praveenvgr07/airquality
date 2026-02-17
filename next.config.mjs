/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['react-globe.gl', 'three'],
    typescript: {
        ignoreBuildErrors: true,
    },
    turbopack: {
        root: '.',
    },
};

export default nextConfig;
