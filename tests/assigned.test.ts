import { test } from "bun:test";
import { FlowClient } from "../index.ts";

const client = new FlowClient({
    apiKey: Bun.env.FLOW_API_KEY as string
});

test("Assigned flow test", async () => {
    // x8evnwkchgoczfmlentva8iios4yyy1z3yir
    console.log(
        await client.createAssignedFlow({
            flow: {
                type: "edge",
                name: "New Assigned Edge Flow!",
                description: "Wow!",
                includedCredentials: ["e42ecda7-7764-4424-a48c-6b452c296bef"],
                variables: [
                    {
                        type: "string",
                        value: "Hello!",
                        name: "message"
                    }
                ],
                environmentalVariables: [
                    {
                        key: "TEST_KEY",
                        value: "Works"
                    }
                ]
            },
            assign: {
                type: "password"
            }
        })
    )

    client.buildAssignedFlow("12-12-12-12", {
        "node_id": {
            name: "dqwdqwdwqdqw"
        },
        "node_id2": {
            name: "12"
        },
    }, [
        {
            from: "node_id",
            fromHandle: "node_handle",

            to: "entry",
            toHandle: "entry"
        }
    ])

})