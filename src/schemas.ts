import type { UUID } from "./client.ts";
import {
    array,
    assert,
    boolean,
    create,
    defaulted as d,
    define,
    intersection,
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

export const PayloadSchema = object({
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

export const VariableSchema = intersection([
    union([
        object({
            type: literal("string"),
            value: string()
        }),
        object({
            type: literal("number"),
            value: number()
        }),
        object({
            type: literal("boolean"),
            value: boolean()
        }),
        object({
            type: literal("json"),
            value: object()
        }),
    ]), object({
        name: string()
    })
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

export const CreateAssignedFlowSchema = object({
    flow: intersection([
        union([
            object({
                type: literal("edge"),
            }),
            object({
                type: literal("simple"),
                region: string(),

                memory: d(number(), 128),
                timeout: d(number(), 3),
                storage: d(number(), 512),
            }),
        ]),
        BaseAssignedFlowSchema
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
