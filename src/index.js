const core = require('@actions/core');
const github = require('@actions/github');
const validatePrTitle = require('./validatePrTitle');

async function run() {
  try {
    const client = new github.GitHub(process.env.GITHUB_TOKEN);

    const pullRequestContext = github.context.payload.pull_request;
    if (!pullRequestContext) {
      throw new Error(
        "This action can only be invoked in `pull_request` events. Otherwise the pull request can't be inferred."
      );
    }

    const owner = pullRequestContext.base.user.login;
    const repo = pullRequestContext.base.repo.name;

    // The pull request info on the context isn't up to date. When
    // the user updates the title and re-runs the workflow, it would
    // be outdated. Therefore fetch the pull request via the REST API
    // to ensure we use the current title.
    const {data: pullRequestData} = await client.pulls.get({
      owner,
      repo,
      pull_number: pullRequestContext.number
    });

    console.log(`Number of commits = ${!!pullRequest.commits && pullRequest.commits.length}`);

    await validatePrTitle(pullRequestData.title);
  } catch (error) {
    core.setFailed(error.message);
  }
};

module.exports = run;
