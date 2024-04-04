import { fetch } from "node-fetch-native";
import { assert, PayloadSchema } from "../schemas.ts";
import { BaseClient } from "../base.ts";

export type FlowEdgePayload = {
    uuid: string,
    variables?: Record<string, unknown>,
    session: {
        id: string,
        globalId?: string
    },
    override?: {
        nodes?: Record<string, {
            inputs?: Record<string, unknown>
        }>
    },
    config?: {
        realTimeLogging?: boolean,
        caching?: boolean
    }
}

export type FlowEdgeConfig = {
    apiExecutionURL: string;
    apiURL: string;
}

export interface IFlowEdge {
    config: FlowEdgeConfig;
    apiKey: string;
}

export class FlowEdge extends BaseClient implements IFlowEdge {
    config: FlowEdgeConfig;
    apiKey: string;

    constructor(apiKey: string, config?: Partial<FlowEdgeConfig>) {
        super();
        this.apiKey = apiKey;
        this.config = {
            apiExecutionURL: config?.apiExecutionURL ?? "https://flow-executor.nouro-flow.workers.dev",
            apiURL: config?.apiURL ?? ""
        };
    }

    getHeaders() {
        return {
            "Authorization": `Bearer ${this.apiKey}`,
            "Content-Type": "application/json"
        }
    }

    /**
     * This function executes flow with type `simple`
     * Returns Response if execution was successful
     * @param payload
     */
    async execute(payload: FlowEdgePayload): Promise<Response> {
        try {
            /* Validate payload */
            assert(payload, PayloadSchema);

            return await fetch(this.config.apiExecutionURL, {
                method: "POST",
                body: JSON.stringify(payload),
                headers: this.getHeaders()
            });
        } catch (e) {
            throw e;
        }
    }
}