const core = require("@actions/core");
const github = require("@actions/github");
const fs = require("fs").promises;
const axios = require("axios");

const API_URL = "https://api.deeptest.sh";

async function run() {
  try {
    // Get input parameters from action.yml
    const apiKey = core.getInput("api-key");
    const deploymentUrl = core.getInput("deployment-url");

    console.log("Starting Deeptest action...");

    // Validate required inputs
    if (!apiKey || !deploymentUrl) {
      throw new Error(
        "Missing required inputs: api-key and deployment-url must be provided"
      );
    }

    // Get GitHub context
    const context = github.context;
    const sha = context.sha;
    const prNumber = context.payload.pull_request?.number;
    const prSha = context.payload.pull_request?.head.sha;

    console.log(`Current SHA: ${sha}`);
    console.log(`Pull Request SHA: ${prSha}`);
    console.log(`Pull Request #: ${prNumber}`);

    // Prepare the request payload based on GithubDiffActionRequest model
    const requestPayload = {
      repository_full_name: context.payload.repository.full_name,
      sha: prSha,
      deployment_url: deploymentUrl,
      pull_request: context.payload.pull_request || null,
      commit_author:
        context.payload.pull_request?.user || context.payload.sender || null,
    };

    // Make the API request
    console.log("Making API request to receive preview deployment...");
    const targetUrl = `${API_URL}/v1/github/receive-preview-deployment`;
    console.log("Target URL:", targetUrl);
    const { data } = await axios.post(targetUrl, requestPayload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("API Response:", data);

    console.log("✅ Successfully authenticated");
    console.log(`✅ Action complete!`);
  } catch (error) {
    console.log("❌ Error:", error.message);
    core.setFailed(error.message);
  }
}

run();
