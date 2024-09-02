import { type ClientSchema, a, defineData } from "@aws-amplify/backend"; // imports backend schema from amplify

const schema = a.schema({
  BedrockResponse: a.customType({ // defines structure of the response from bedrock model
    body: a.string(), // string which contains main content of the response
    error: a.string(), // error field use to capture any error messages
  }),

  askBedrock: a // query which allows users to request info from bedrock model
    .query()
    .arguments({ ingredients: a.string().array() }) // query accepts an array of strings as arguments, representing ingredients
    .returns(a.ref("BedrockResponse")) // query returns the response of type 'BedrockReponse' defined earlier
    .authorization((allow) => [allow.authenticated()]) // query restricted to authorized users only
    .handler(
      a.handler.custom({ entry: "./bedrock.js", dataSource: "bedrockDS" }) // specifies query should be handled by custom handler in bedrock.js file
    ),
});

export type Schema = ClientSchema<typeof schema>; // ensures parts of app that interact with the schema are type-safe

export const data = defineData({ // consttant that holds complete data config
  schema, // schema defined earlier
  authorizationModes: { // specifies how the API is secured
    defaultAuthorizationMode: "apiKey", // default authorization mode is API key
    apiKeyAuthorizationMode: {
      expiresInDays: 30, // configures API key to expire in 30 days
    },
  },
});

// schema is defined for the backend, using custom data type BedRock response and then askBedrock used to interact with an AI models
// query restricted to authenticated users and the API uses an API key for authorization by defaultAuthorizationMode
// custom handler in bedrock.js which interacts with bedrock
