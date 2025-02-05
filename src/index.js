const core = require("@actions/core");
const github = require("@actions/github");
const fs = require("fs").promises;

const API_URL = "http://api.deeptest.sh";

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

    console.log(`Current SHA: ${sha}`);
    if (prNumber) {
      console.log(`Pull Request #: ${prNumber}`);
    }

    // Prepare the request payload based on GithubDiffActionRequest model
    const requestPayload = {
      repository_full_name: context.payload.repository.full_name,
      sha: sha,
      deployment_url: deploymentUrl,
      pull_request: context.payload.pull_request || null,
      commit_author:
        context.payload.pull_request?.user || context.payload.sender || null,
      num_tries: 2,
    };

    // Make the API request
    console.log("Making API request to receive preview deployment...");
    const targetUrl = `${API_URL}/v1/github/receive-preview-deployment`;
    console.log("Target URL:", targetUrl);
    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestPayload),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log("API Response:", data);

    console.log("✅ Successfully authenticated");
    console.log(`✅ Action complete!`);
  } catch (error) {
    console.log("❌ Error:", error.message);
    core.setFailed(error.message);
  }
}

run();
