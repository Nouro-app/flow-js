


export class BaseClient {
    static getHeaders(apiKey: string) {
        return {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
        }
    }
}