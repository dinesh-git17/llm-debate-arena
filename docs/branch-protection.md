# Branch Protection Configuration

This document describes the branch protection rules that should be configured in GitHub repository settings.

## Configuring Branch Protection Rules

Navigate to: **Repository Settings > Branches > Branch protection rules**

---

## `main` Branch Protection

Click "Add rule" and configure:

### Branch name pattern

```
main
```

### Protection Settings

| Setting                                                          | Value                 |
| ---------------------------------------------------------------- | --------------------- |
| **Require a pull request before merging**                        | Enabled               |
| Require approvals                                                | 1                     |
| Dismiss stale pull request approvals when new commits are pushed | Enabled               |
| Require review from Code Owners                                  | Enabled               |
| **Require status checks to pass before merging**                 | Enabled               |
| Require branches to be up to date before merging                 | Enabled               |
| **Status checks that are required:**                             |                       |
| - `lint`                                                         | Required              |
| - `typecheck`                                                    | Required              |
| - `build`                                                        | Required              |
| **Require conversation resolution before merging**               | Enabled               |
| **Do not allow bypassing the above settings**                    | Enabled               |
| **Restrict who can push to matching branches**                   | Enabled (admins only) |
| **Allow force pushes**                                           | Disabled              |
| **Allow deletions**                                              | Disabled              |

---

## `dev` Branch Protection

Click "Add rule" and configure:

### Branch name pattern

```
dev
```

### Protection Settings

| Setting                                          | Value       |
| ------------------------------------------------ | ----------- |
| **Require a pull request before merging**        | Optional    |
| **Require status checks to pass before merging** | Enabled     |
| Require branches to be up to date before merging | Optional    |
| **Status checks that are required:**             |             |
| - `lint`                                         | Required    |
| - `typecheck`                                    | Required    |
| - `build`                                        | Required    |
| **Allow force pushes**                           | Admins only |
| **Allow deletions**                              | Disabled    |

---

## Required GitHub Secrets

Navigate to: **Repository Settings > Secrets and variables > Actions**

Add the following repository secrets:

| Secret Name         | Description            | How to Obtain                                                        |
| ------------------- | ---------------------- | -------------------------------------------------------------------- |
| `VERCEL_TOKEN`      | Vercel API token       | [Vercel Dashboard](https://vercel.com/account/tokens) > Create Token |
| `VERCEL_ORG_ID`     | Vercel organization ID | `.vercel/project.json` after running `vercel link`                   |
| `VERCEL_PROJECT_ID` | Vercel project ID      | `.vercel/project.json` after running `vercel link`                   |

### Getting Vercel IDs

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel link` in the project directory
3. Check `.vercel/project.json` for `orgId` and `projectId`

---

## Rulesets (Alternative to Branch Protection)

GitHub also supports Rulesets which provide more granular control. If using Rulesets instead:

Navigate to: **Repository Settings > Rules > Rulesets**

### Main Ruleset

```json
{
  "name": "main-protection",
  "target": "branch",
  "enforcement": "active",
  "conditions": {
    "ref_name": {
      "include": ["refs/heads/main"]
    }
  },
  "rules": [
    { "type": "pull_request" },
    {
      "type": "required_status_checks",
      "parameters": {
        "required_status_checks": [
          { "context": "lint" },
          { "context": "typecheck" },
          { "context": "build" }
        ]
      }
    },
    { "type": "non_fast_forward" },
    { "type": "deletion" }
  ]
}
```

---

## Verification

After configuring, verify protection is working:

1. Try to push directly to `main` - should be blocked
2. Create a PR to `main` - should require status checks
3. Try to merge without approvals - should be blocked
4. Try to force push - should be blocked
