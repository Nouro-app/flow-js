import type { FormData } from "node-fetch-native";
import type { Blob } from "node:buffer";

export interface WrappedResponse {
    toStream<T extends Uint8Array | string = Uint8Array, O = ReadableStream<T> | null>(): O,
    toJSON<T extends object = object>(): Promise<T>,
    toBuffer(): Promise<ArrayBuffer>,
    toBlob(): Promise<Blob>,
    toText(): Promise<string>,
    toFormData(): Promise<FormData>,

    toResponse(): Response
}

export class BaseClient {
    static getHeaders(apiKey: string) {
        return {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
        }
    }

    wrapResponse(res: Response): WrappedResponse {
        return {
            toStream: <T extends Uint8Array | string = Uint8Array, O = ReadableStream<T> | null>(): O => res.body as O,
            toJSON: async <T extends object = object>(): Promise<T> => await res.json() as T,
            toBuffer: async (): Promise<ArrayBuffer>  => await res.arrayBuffer(),
            toBlob: async (): Promise<Blob> => await res.blob(),
            toText: async (): Promise<string> => await res.text(),
            toFormData: async (): Promise<FormData> => await res.formData(),

            toResponse: (): Response => res
        }
    }
}