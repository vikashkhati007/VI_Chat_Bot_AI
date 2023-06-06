/** @type {import('next').NextConfig} */
require('dotenv').config()
const nextConfig = {
    experimental: {serverActions: true},
}

module.exports = nextConfig
