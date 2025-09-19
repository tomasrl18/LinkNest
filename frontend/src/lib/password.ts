const encoder = new TextEncoder();
const PEPPER = import.meta.env.VITE_PASSWORD_PEPPER ?? 'linknest-pepper';

const toBase64 = (bytes: Uint8Array) => {
    if (typeof globalThis.btoa === 'function') {
        let binary = '';
        bytes.forEach(byte => {
            binary += String.fromCharCode(byte);
        });
        return globalThis.btoa(binary);
    }

    const buffer = (globalThis as { Buffer?: { from(data: Uint8Array): { toString(encoding: string): string } } }).Buffer;
    if (buffer) {
        return buffer.from(bytes).toString('base64');
    }

    throw new Error('No base64 encoder available');
};

const hashWithSubtle = async (input: Uint8Array) => {
    const subtle = globalThis.crypto?.subtle;
    if (!subtle) {
        throw new Error('Secure hashing requires Web Crypto support');
    }
    const buffer = await subtle.digest('SHA-256', input);
    return new Uint8Array(buffer);
};

export const deriveSupabasePassword = async (password: string) => {
    const prepared = encoder.encode(`${PEPPER}:${password}`);
    const hashBytes = await hashWithSubtle(prepared);
    const base64Hash = toBase64(hashBytes).replace(/=+$/, '');
    return `A${base64Hash}!1a`;
};
