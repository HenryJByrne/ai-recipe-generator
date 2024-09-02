import { defineAuth } from "@aws-amplify/backend"; // imports defineAuth function from AWS amplify backend - used to configure authentication settings for backend amplify

export const auth = defineAuth({ // auth holds the authentication configuration
  loginWith: { // specifies users will log in with their email adresses
    email: {
      verificationEmailStyle: "CODE", // specifies code will be used to to verify email
      verificationEmailSubject: "Welcome to the AI-Powered Recipe Generator!", // defines subject line of the verification email
      verificationEmailBody: (createCode) => // defines body of email
        `Use this code to confirm your account: ${createCode()}`, // createCode is function passed in to create the code for verification, text is the body of the email
    },
  },
});
