const {
  LINEAR_API_KEY,
  LINEAR_ISSUE_ID,
  GITHUB_REPOSITORY,
  GITHUB_RUN_ID,
  GITHUB_SHA,
  GITHUB_REF_NAME,
  VALIDATE_RESULT,
  DEPLOY_RESULT,
  DEPLOYMENT_URL
} = process.env;

if (!LINEAR_API_KEY || !LINEAR_ISSUE_ID) {
  throw new Error("Missing LINEAR_API_KEY or LINEAR_ISSUE_ID secret.");
}

const isDeliveryBranch = GITHUB_REF_NAME === "main";
const deployWasRequired = isDeliveryBranch;
const pipelineSucceeded =
  VALIDATE_RESULT === "success" &&
  (!deployWasRequired || DEPLOY_RESULT === "success");

const runUrl = `https://github.com/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}`;
const shortSha = GITHUB_SHA?.slice(0, 7) ?? "unknown";
const deploymentLine =
  deployWasRequired && DEPLOYMENT_URL
    ? `- Deploy: ${DEPLOYMENT_URL}`
    : `- Deploy: ${deployWasRequired ? DEPLOY_RESULT : "no solicitado para esta rama"}`;

const body = [
  `## ${pipelineSucceeded ? "Entrega exitosa" : "Entrega con error"}`,
  "",
  `- Rama: ${GITHUB_REF_NAME}`,
  `- Commit: ${shortSha}`,
  `- Typecheck/test/build: ${VALIDATE_RESULT}`,
  deploymentLine,
  `- GitHub Actions: ${runUrl}`
].join("\n");

async function linearRequest(query, variables) {
  const response = await fetch("https://api.linear.app/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: LINEAR_API_KEY
    },
    body: JSON.stringify({ query, variables })
  });

  const payload = await response.json();
  if (!response.ok || payload.errors?.length) {
    throw new Error(JSON.stringify(payload.errors ?? payload, null, 2));
  }

  return payload.data;
}

const issueData = await linearRequest(
  `query Issue($id: String!) {
    issue(id: $id) {
      id
      identifier
      title
    }
  }`,
  { id: LINEAR_ISSUE_ID }
);

if (!issueData.issue?.id) {
  throw new Error(`Linear issue not found: ${LINEAR_ISSUE_ID}`);
}

const commentData = await linearRequest(
  `mutation CommentCreate($input: CommentCreateInput!) {
    commentCreate(input: $input) {
      success
      comment {
        id
        url
      }
    }
  }`,
  {
    input: {
      issueId: issueData.issue.id,
      body
    }
  }
);

if (!commentData.commentCreate?.success) {
  throw new Error("Linear commentCreate did not report success.");
}

console.log(`Linear feedback posted: ${commentData.commentCreate.comment.url}`);
