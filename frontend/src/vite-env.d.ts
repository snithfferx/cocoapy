/// <reference types="vite/client" />

interface ImportMetaEnv {
    // APP
    readonly VITE_APP_AUTHOR: string;
    readonly VITE_APP_FULL_NAME: string;
    readonly VITE_APP_NAME: string;
    readonly VITE_APP_VERSION: string;
    readonly VITE_APP_SHORT_VERSION: number;
    // API
    readonly VITE_API_HOST: string;
    readonly VITE_API_PORT: number;
    readonly VITE_API_KEY: string;
    readonly VITE_API_VERSION: number;
    readonly VITE_API_DEBUG: boolean;
    readonly VITE_API_TOKEN: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}