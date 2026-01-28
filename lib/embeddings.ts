// lib/embeddings.ts
import { pipeline, env } from '@xenova/transformers'

// FORCE WASM backend (no native Node.js bindings)
env.backends.onnx.wasm.proxy = false

// Disable local model loading (use CDN)
env.allowLocalModels = false
env.allowRemoteModels = true

// Use single thread for WASM
env.backends.onnx.wasm.numThreads = 1

// Set cache directory
if (typeof process !== 'undefined' && process.cwd) {
  env.cacheDir = './.cache/transformers'
}

// Singleton pattern for model
let embeddingModel: any = null
let modelLoading: Promise<any> | null = null

export async function getEmbeddingModel() {
  // If already loaded, return it
  if (embeddingModel) {
    return embeddingModel
  }
  
  // If currently loading, wait for it
  if (modelLoading) {
    return modelLoading
  }
  
  // Start loading
  modelLoading = (async () => {
    console.log('🔄 Loading embedding model (WASM backend, first time only)...')
    console.log('This may take 30-60 seconds on first load...')
    
    const model = await pipeline(
      'feature-extraction',
      'Xenova/all-MiniLM-L6-v2',
      {
        quantized: true, // Use quantized version (smaller, faster)
        progress_callback: (progress: any) => {
          if (progress.status === 'downloading') {
            console.log(`Downloading: ${progress.file} - ${Math.round(progress.progress)}%`)
          } else if (progress.status === 'done') {
            console.log(`✓ Downloaded: ${progress.file}`)
          }
        }
      }
    )
    
    console.log('✅ Embedding model loaded and cached!')
    embeddingModel = model
    modelLoading = null
    return model
  })()
  
  return modelLoading
}

export async function createEmbedding(text: string): Promise<number[]> {
  try {
    const model = await getEmbeddingModel()
    
    const output = await model(text, { 
      pooling: 'mean', 
      normalize: true 
    })
    
    // Convert to regular array
    const embedding = Array.from(output.data) as number[]
    
    return embedding
  } catch (error: any) {
    console.error('Error creating embedding:', error)
    throw new Error(`Failed to create embedding: ${error.message}`)
  }
}

export async function createEmbeddings(texts: string[]): Promise<number[][]> {
  const embeddings: number[][] = []
  
  for (const text of texts) {
    const embedding = await createEmbedding(text)
    embeddings.push(embedding)
  }
  
  return embeddings
}