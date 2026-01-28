// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Exclude native modules from bundling
      config.externals.push({
        'sharp': 'commonjs sharp',
        'onnxruntime-node': 'commonjs onnxruntime-node'
      })
      
      // Ignore native .node files
      config.module = config.module || {}
      config.module.rules = config.module.rules || []
      
      config.module.rules.push({
        test: /\.node$/,
        use: 'node-loader'
      })
    }
    
    // Add fallbacks for Node.js modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
      stream: false,
      buffer: false,
    }
    
    // Ignore specific warnings
    config.ignoreWarnings = [
      { module: /node_modules\/node-fetch\/lib\/index\.js/ },
      { module: /node_modules\/punycode\/punycode\.js/ },
    ]
    
    return config
  },
  
  // This is important for transformers.js
  experimental: {
    serverComponentsExternalPackages: ['sharp', 'onnxruntime-node']
  }
}

export default nextConfig