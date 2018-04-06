
# Alexa ask Mura

This is just an example of how you can connect an Alexa skill to the Mura REST API.

For this to work:

1) You must be on Mura 7.0 or greater
 - 1a) Create your developer account @ http://developer.amazon.com
 - 1b) Create an AWS account @ http://aws.amazon.com/ (you'll need this for the Lambda Function)
 - 1c) Create your skill and copy and past the skill.json into the `JSON Editor` of the build page for your skill (this will give you
   the same interaction model from my demo.)

2) Place the `/mura-alexa` folder in the:
 - 7.0 - `{siteid}/includes/{theme}/display_objects`
 - 7.1 - `sites/{siteid}/modules`
 - 2b) `?appreload&applyDBUpdates`

3) For help creating your Lambda Function see the following: https://developer.amazon.com/docs/custom-skills/host-a-custom-skill-as-an-aws-lambda-function.html

> I used the `alexa-skill-kit-sdk-factskill` and removed things I didn't need.

4) Once you have that created.  Copy the contents of `index.js` into the on page editor in your Lambda Function.

5) To link the Function to your skill you'll need to take the ARN number of your function and put it in as the endpoint of your skill back in the skill builder.

6) Configure a test be copying the `lambda-test.json` and pasting it in the window.  This is the same JSON that the Skill/IO returns when you're testing in the Portal.  So this could change as you change your skill.  You can copy and paste over this test as you edit your skill.
> be sure to place your alexa skill id in this file
