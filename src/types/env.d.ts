/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PREFIX: string
  readonly VITE_HOST: string
  readonly VITE_IMG_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
