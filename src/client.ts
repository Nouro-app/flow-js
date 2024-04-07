import type { PayloadRegion } from "./types";
import { create, CreateAssignedFlowSchema } from "./schemas.ts";
import { FlowSimple } from "./flows/simple.ts";
import { FlowEdge } from "./flows/edge.ts";
import { fetch } from "node-fetch-native";
import { BaseClient } from "./base.ts";

export interface IFlowClient {
    config: FlowClientConfig;
    clientUrl: string;
    apiUrl: string;

    createSimpleFlow(): FlowSimple
}

export type FlowClientConfig = {
    apiKey: string;
    apiUrl?: string;

    client?: {
        url?: string;
    }
}

export type EnvironmentalVariable = {
    key: string;
    value: string;
}

export type Variable = ({
    type: "string";
    value: string;
} | {
    type: "number";
    value: number;
} | {
    type: "boolean";
    value: boolean;
} | {
    type: "json";
    value: object;
}) & {
    /**
     * Should be unique name in flow
     */
    name: string;
}

export type LocalCredential = {
    /**
     * If passes object with name, tries find credential using name not id
     */
    credential_id: string | {
        name: string;
    };

    /**
     * Name of credential
     * Max length: 50
     */
    name: string;

    inputs: {
        name: string;
        value: string;
    }[]
}

export type UUID = `${string}-${string}-${string}-${string}`;

export type BaseAssignedFlow = {
    name: string;

    /**
     * @default undefined
     */
    description?: string;

    /**
     * Base environmental variables
     */
    variables?: Variable[]

    /**
     * Base environmental variables
     */
    environmentalVariables?: EnvironmentalVariable[];

    /**
     * Allows to include credentials from account
     * - Expects uuid's of credentials
     */
    includedCredentials?: UUID[];

    /**
     * Creates local credential
     */
    credentials: LocalCredential[]
}

export type CreateAssignedOutput = {
    /**
     * Password to access assigned flow
     */
    password: string;

    /**
     * Flow uuid
     */
    uuid: UUID;
}

export type CreateAssigned = {
    flow: {
        type: "edge";
    } & BaseAssignedFlow | {
        type: "simple";
        region: PayloadRegion;

        /**
         * @default 128
         */
        memory?: number;

        /**
         * @default 3
         */
        timeout?: number;

        /**
         * @default 512
         */
        storage?: number;
    } & BaseAssignedFlow;
    
    limits?: {
        /**
         * @default 1000
         */
        maxExecutions?: number;

        /**
         * @default 100
         */
        maxBuilds?: number;

        /**
         * @default 20
         */
        maxVariables?: number;

        /**
         * @default 10
         */
        maxEnvironmentalVariables?: number;
    };

    assign: {
        type: "password";
        /**
         * If not set, would automatically set in server
         * Properties:
         * - Min length: 12
         * - Max length: 48
         */
        password?: string;
    };
}

export type BuildAssignedFlowNodes = Record<string, {
    name: string;
    inputs?: Record<string, unknown>
}>

export type BuildAssignedFlowConnections<Nodes> = {
    from: Nodes;
    fromHandle: string;

    to: Nodes | "entry";
    toHandle: string | "entry";
}[];

export const NOURO_FLOW_BASE_CLIENT_URL = process.env?.NOURO_FLOW_BASE_CLIENT_URL
    ?? "http://localhost:3000";

export const NOURO_FLOW_BASE_API_URL = process.env?.NOURO_FLOW_BASE_CLIENT_URL
    ?? "http://localhost:3003/v1";

export class FlowClient extends BaseClient implements IFlowClient {
    config: FlowClientConfig;
    clientUrl: string;
    apiUrl: string;

    constructor(cfg: FlowClientConfig) {
        super();
        this.config = cfg;
        this.clientUrl = cfg?.client?.url ?? NOURO_FLOW_BASE_CLIENT_URL;
        this.apiUrl = cfg?.apiUrl ?? NOURO_FLOW_BASE_API_URL;
    }

    /**
     * Returns new simple flow
     */
    createSimpleFlow() {
        return new FlowSimple(this.config.apiKey);
    }

    createEdgeFlow() {
        return new FlowEdge(this.config.apiKey);
    }

    /**
     * Creates assigned flow
     *
     * **NOTE:** This only allowed in PREMIUM plan!
     */
    async createAssignedFlow(data: CreateAssigned) {
        const validatedData = create(data, CreateAssignedFlowSchema);

        try {
            const res = await fetch(`${this.apiUrl}/flow/assigned/create`, {
                method: "POST",
                headers: BaseClient.getHeaders(this.config.apiKey),
                body: JSON.stringify(validatedData)
            });

            return await res.json() as CreateAssignedOutput;
        } catch (e) {
            throw e;
        }
    }

    /**
     * @param uuid
     * @param directPassword
     * Not recommended to pass password directly, instead pass it in browser
     */
    generateAssignedFlowLink(uuid: string, directPassword?: string) {
        const q = new URLSearchParams(`assign_type=password&password=${Buffer.from(directPassword ?? "").toString("base64")}`);
        return `${this.clientUrl}/assigned/${uuid}/flow?${q}`;
    }

    /**
     * @param uuid
     * Not recommended to pass password directly, instead pass it in browser
     * @param cfg
     */
    static generateAssignedFlowLink(uuid: string, cfg?: {
        directPassword?: string,
        clientUrl?: string
    }) {
        const q = new URLSearchParams(`assign_type=password&password=${Buffer.from(cfg?.directPassword ?? "").toString("base64")}`);
        return `${cfg?.clientUrl ?? NOURO_FLOW_BASE_CLIENT_URL}/assigned/${uuid}/flow?${q}`;
    }

    /**
     * This function is currently not supported and will be supported in future versions.
     * API may change!
     *
     * @param uuid
     * @param nodes
     * @param connections
     * @deprecated This function is currently not supported and will be supported in future versions.
     */
    async buildAssignedFlow<Nodes extends BuildAssignedFlowNodes = BuildAssignedFlowNodes>(uuid: UUID, nodes: Nodes, connections: BuildAssignedFlowConnections<keyof Nodes>) {
        console.log("* Currently this feature is not present. But don't worry this future would be present soon!")
    }
}