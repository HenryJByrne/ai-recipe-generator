export function request(ctx) { // defines a HTTP request sent to AWS bedrock to request recipe from LLM, ctx passed in as an argument
    const { ingredients = [] } = ctx.args; // parses the arguments into an array, which is empty if their are no ingredients provided

    // Construct the prompt with the provided ingredients
    const prompt = `Suggest a recipe idea using these ingredients: ${ingredients.join(", ")}.`; // joins ingredients into a sentence to query the LLm for the recipe

    // Return the request configuration
    return {
      resourcePath: `/model/anthropic.claude-3-sonnet-20240229-v1:0/invoke`, //specifies API endpoint
      method: "POST", // specifies HTTP post
      params: { // contains request headers and body
        headers: {
          "Content-Type": "application/json", // content type set to application/json
        },
        body: JSON.stringify({ // specifies JSON string
          anthropic_version: "bedrock-2023-05-31", // specifies version of model to use
          max_tokens: 1000, // limits response length to 1000 tokens
          messages: [ // array of message objects
            {
              role: "user", // role set to user
              content: [
                {
                  type: "text",
                  text: `\n\nHuman: ${prompt}\n\nAssistant:`, // contains the message to put into the LLM
                },
              ],
            },
          ],
        }),
      },
    };
  }

  export function response(ctx) { // takes ctx as an argument
    // Parse the response body
    const parsedBody = JSON.parse(ctx.result.body); // parses JSON string and converts to JavaScript object stored in parsedBody
    // Extract the text content from the response
    const res = {
      body: parsedBody.content[0].text, // extracts text content from the first element in parsedBody.content array
    };
    // Return the response
    return res; // returns this response
  }

// lambda function runs
