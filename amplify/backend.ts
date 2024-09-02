import { defineBackend } from "@aws-amplify/backend"; // imports defineBackend from aws amplify
import { data } from "./data/resource"; // imports file from resource file in data folder
import { PolicyStatement } from "aws-cdk-lib/aws-iam"; // imports AWS policy from the aws IAM
import { auth } from "./auth/resource"; // imports local authentication method for the email written earlier

const backend = defineBackend({ // defines the backend by taking the auth and data file imported from other file locations - auth is the email verification
  auth,
  data,
});

const bedrockDataSource = backend.data.resources.graphqlApi.addHttpDataSource( // stores the http data source added to GraphQL API
  "bedrockDS", // name of data source
  "https://bedrock-runtime.us-east-1.amazonaws.com", // used to invoke models hosted on AWS bedrock
  {
    authorizationConfig: {
      signingRegion: "us-east-1", // region
      signingServiceName: "bedrock", // service name
    },
  }
);

bedrockDataSource.grantPrincipal.addToPrincipalPolicy( // this method adds a policy statement to the authority authorized to use bedrockDataSource
  new PolicyStatement({
    resources: [
      "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-sonnet-20240229-v1:0", // specifies the ARN - Amazon reosurce name of bedrock model to interact with
    ],
    actions: ["bedrock:InvokeModel"], // grants the bedrock: InvokeModel action, allows invoking of specified bedrock model

  })
);

// backend defined with authentication and data resources specified in these files
// GraphQL API includes HTTP data source that interacts with AWS bedrock, invoking Claude-3 model
// IAM permissions - policy attached to data source, allowing invoking of the Bedrock model
