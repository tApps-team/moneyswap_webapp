/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_URL: string;
  readonly VITE_TG_BOT_URL: string;
  readonly VITE_STRAPI_URL: string;
  readonly VITE_TG_CHANNEL_URL: string;
  readonly VITE_TG_MINIAPP_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
