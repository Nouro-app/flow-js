import type { PayloadRegion } from "../types";
import { fetch } from "node-fetch-native";
import { assert, PayloadSchema } from "../schemas.ts";
import { BaseClient } from "../base.ts";

export type FlowSimplePayload = {
    uuid: string,
    region: PayloadRegion,
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

export type FlowSimpleConfig = {
    apiExecutionURL: string;
    apiURL: string;
}

export interface IFlowSimple {
    config: FlowSimpleConfig;
    apiKey: string;
}

export class FlowSimple extends BaseClient implements IFlowSimple {
    config: FlowSimpleConfig;
    apiKey: string;

    constructor(apiKey: string, config?: Partial<FlowSimpleConfig>) {
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
    async execute(payload: FlowSimplePayload): Promise<Response> {
        try {
            /* Validate payload */
            assert(payload, PayloadSchema);

            return await fetch(this.config.apiExecutionURL, {
                method: "POST",
                body: JSON.stringify({
                    ...payload,
                    type: "simple"
                }),
                headers: this.getHeaders()
            });
        } catch (e) {
            throw e;
        }
    }
}