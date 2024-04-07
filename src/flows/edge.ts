import { fetch } from "node-fetch-native";
import { assert, EdgePayloadSchema } from "../schemas.ts";
import { BaseClient, type WrappedResponse } from "../base.ts";

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
            apiExecutionURL: config?.apiExecutionURL ?? "https://executor.flow.nouro.services",
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
    async execute(payload: FlowEdgePayload): Promise<WrappedResponse> {
        try {
            /* Validate payload */
            assert(payload, EdgePayloadSchema);

            return this.wrapResponse(
                await fetch(this.config.apiExecutionURL, {
                    method: "POST",
                    body: JSON.stringify({
                        ...payload,
                        /* Temporal region, because the superstruct in flow-executor have issues with intersection */
                        region: "none",
                        type: "edge"
                    }),
                    headers: this.getHeaders()
                })
            );
        } catch (e) {
            throw e;
        }
    }
}