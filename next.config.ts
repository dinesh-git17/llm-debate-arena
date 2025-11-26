import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  serverExternalPackages: ['tiktoken'],
  experimental: {
    turbo: {
      rules: {
        '*.wasm': {
          loaders: ['@vercel/turbopack-ecmascript/wasm'],
          as: '*.js',
        },
      },
    },
  },
  webpack: (config, { isServer }) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    }

    if (isServer) {
      config.output.webassemblyModuleFilename = './../static/wasm/[modulehash].wasm'
    } else {
      config.output.webassemblyModuleFilename = 'static/wasm/[modulehash].wasm'
    }

    return config
  },
}

export default nextConfig
