import {
    create,
    intersection,
    literal,
    number,
    object,
    string,
    union,
    defaulted as d,
    assign,
} from "superstruct";
import { BaseAssignedFlowSchema } from "../src/schemas.ts";


const TestSchema = intersection([
    BaseAssignedFlowSchema,
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
]);

console.log(
    create({
        name: "1212",
        value: "----"
    }, assign(
        object({
            name: string()
        }),
        object({
            value: string()
        })
    ))
)

console.log(
    create({
        type: "edge",
        variables: [
            {
                name: "message",
                type: "string",
                value: "Hello!"
            }
        ]
    }, TestSchema)
)