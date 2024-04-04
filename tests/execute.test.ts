import { FlowSimple } from "../index.ts";
import { test } from "bun:test";

const flowSimple = new FlowSimple(Bun.env.FLOW_API_KEY as string);

test("Execute assigned flow", async () => {
    const response = await flowSimple.execute({
        "uuid": "2af201a1-84fb-4ad3-9ea7-22178966428d",
        "session": {
            "id": "2af201a1-84fb-4ad3-9ea7-22178966428d"
        },
        "variables": {
            "number": 123
        },
        "config": {
            "realTimeLogging": false,
            "caching": false
        },
        "region": "eu-north-1",
    });

    console.log(await response.json())
})

test("Execute flow", async () => {
    const response = await flowSimple.execute({
        "uuid": "a400d8ca-4f9f-46b3-83c4-14d0db932e73",
        "session": {
            "id": "3131496e-cff4-4ac7-bad9-e03ffd825aeb"
        },
        "variables": {
            "message": "Hello!"
        },
        "config": {
            "realTimeLogging": false,
            "caching": false
        },
        "region": "eu-north-1",
    });

    const txt = new TextDecoder();

    if (!response.body) return;

    for await (const chunk of response.body) {
        console.log(txt.decode(chunk))
    }
})