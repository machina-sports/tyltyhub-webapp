interface RuntimeConfig {
  imageContainerAddress: string
}

let cachedConfig: RuntimeConfig | null = null

export const getRuntimeConfig = async (): Promise<RuntimeConfig> => {
  if (cachedConfig) return cachedConfig

  return {
    imageContainerAddress: process.env.NEXT_PUBLIC_IMAGE_CONTAINER_ADDRESS || 'https://github.com/machina-sports/machina-agentics.git'
  }
} 