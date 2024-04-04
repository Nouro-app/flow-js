Nouro flow package, which allows to execute flows

To execute simple flow:
```js
import { FlowSimple } from "@nouro/flow";

const apiKey = process.env.FLOW_ENV_KEY;

const flow = new FlowSimple(apiKey);

// Returns response
const res = await flow.execute(payload);

for (const chunk of res.body) {
    console.log(chunk);
}
```

To execute edge flow:
```js
import { FlowEdge } from "@nouro/flow";

const apiKey = process.env.FLOW_ENV_KEY;

const flow = new FlowEdge(apiKey);

// Returns response
const res = await flow.execute(payload);

for (const chunk of res.body) {
    console.log(chunk);
}
```