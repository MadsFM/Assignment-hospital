import {Api} from './Api.ts';
const baseUrl = 'http://localhost:3000'

export const apiClient = new Api({
    baseURL: baseUrl,
    headers: {
        "Prefer": "return=representation"
    }
});

//@ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface ImportMetaEnv {
    readonly VITE_APP_BASE_API_URL: string
}