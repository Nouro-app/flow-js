import type { UUID } from "./client.ts";
import {
    array,
    assert,
    boolean,
    create,
    defaulted as d,
    define,
    literal,
    number,
    object,
    optional,
    record,
    string,
    union,
    unknown
} from "superstruct";
import isUUID from "is-uuid"

export {
    assert,
    create
}

export const UUIDSchema = define<UUID>("Uuid", (value) => isUUID.v4(value as string))

export const SimplePayloadSchema = object({
    uuid: string(),
    region: string(),
    variables: optional(record(string(), unknown())),
    session: object({
        id: string(),
        globalId: optional(string())
    }),
    override: optional(object({
        nodes: optional(record(string(), object({
            inputs: optional(record(string(), unknown()))
        })))
    })),
    config: optional(object({
        realTimeLogging: optional(boolean()),
        caching: optional(boolean()),
    }))
})

export const EdgePayloadSchema = object({
    uuid: string(),
    variables: optional(record(string(), unknown())),
    session: object({
        id: string(),
        globalId: optional(string())
    }),
    override: optional(object({
        nodes: optional(record(string(), object({
            inputs: optional(record(string(), unknown()))
        })))
    })),
    config: optional(object({
        realTimeLogging: optional(boolean()),
        caching: optional(boolean()),
    }))
})

export const VariableSchema = union([
    object({
        name: string(),
        type: literal("string"),
        value: string()
    }),
    object({
        name: string(),
        type: literal("number"),
        value: number()
    }),
    object({
        name: string(),
        type: literal("boolean"),
        value: boolean()
    }),
    object({
        name: string(),
        type: literal("json"),
        value: object()
    }),
])

export const EnvironmentalVariableSchema = object({
    key: string(),
    value: string()
})

export const BaseAssignedFlowSchema = object({
    name: string(),
    description: optional(string()),

    variables: d(array(VariableSchema), []),
    environmentalVariables: d(array(EnvironmentalVariableSchema), []),
    includedCredentials: d(array(UUIDSchema), [])
})

export const LocalCredentialFlowSchema = object({
    credential_id: union([
        string(),
        object({
            name: string()
        })
    ]),
    name: string(),
    inputs: array(object({
        name: string(),
        value: string()
    }))
})

export const CreateAssignedFlowSchema = object({
    flow: union([
        object({
            type: literal("edge"),
            name: string(),
            description: optional(string()),

            variables: d(array(VariableSchema), []),
            environmentalVariables: d(array(EnvironmentalVariableSchema), []),
            includedCredentials: d(array(UUIDSchema), []),
            credentials: d(array(LocalCredentialFlowSchema), [])
        }),
        object({
            type: literal("simple"),
            name: string(),
            description: optional(string()),

            variables: d(array(VariableSchema), []),
            environmentalVariables: d(array(EnvironmentalVariableSchema), []),
            includedCredentials: d(array(UUIDSchema), []),
            credentials: d(array(LocalCredentialFlowSchema), []),
            region: string(),

            memory: d(number(), 128),
            timeout: d(number(), 3),
            storage: d(number(), 512)
        }),
    ]),

    limits: optional(object({
        maxExecutions: d(number(), 1000),
        maxBuilds: d(number(), 100),
        maxVariables: d(number(), 20),
        maxEnvironmentalVariables: d(number(), 10),
    })),

    assign: object({
        type: literal("password"),
        password: optional(string())
    })
})
