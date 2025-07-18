---
description: 'Reusable prompt/cookbook for implementing an AI/human compliance guardrail system in any project.'
---

# AI/Human Compliance Guardrail System Cookbook

## Purpose

This prompt provides step-by-step instructions for implementing a robust compliance guardrail system that enforces pre-push and pre-action checks for both AI agents and humans. Use this to ensure that all critical compliance steps (tests, secret scans, documentation, etc.) are confirmed before code is pushed or merged.

## When to Use

- You want to prevent accidental or non-compliant pushes (e.g., with wrong line endings, outdated documentation, untested code, or secrets).
- You want both AI agents and humans to be held to the same compliance standards.
- You need an auditable, repeatable, and transparent compliance workflow.

## Step-by-Step Instructions

### 1. Create a Compliance Checklist Markdown File

- Add a file named `.compliance-checklist.md` at the project root.
- List all required compliance questions as checklist items (e.g., tests run, secrets checked, guardrails followed).
- Example:

```markdown
# Pre-Push Compliance Checklist

- [ ] Have you run the full test suite and did all tests pass? (yes/no):
- [ ] Have you checked for secrets in the codebase and confirmed none are present? (yes/no):
- [ ] Have you followed all .mdc guardrails? (yes/no):
```

### 2. Require Explicit Confirmation

- Before any push or critical action, the AI or user must update each checklist item to "yes".
- Example after confirmation:

```markdown
# Pre-Push Compliance Checklist

- [x] Have you run the full test suite and did all tests pass? (yes)
- [x] Have you checked for secrets in the codebase and confirmed none are present? (yes)
- [x] Have you followed all .mdc guardrails? (yes)
```

### 3. Implement a Guardrail Enforcement Script

- Create a script (e.g., `scripts/ai-guardrail-check.js`) that:
  - Reads all .mdc rules with `alwaysApply: true` in the frontmatter.
  - Checks that `.compliance-checklist.md` is present and all required answers are "yes".
  - Optionally, checks for other technical preconditions (e.g., no uncommitted changes).
  - Blocks the push or action if any check fails.

### 4. Add a Checklist Reset Script

- After a successful push, run a script (e.g., `scripts/reset-compliance-checklist.js`) to reset the checklist to its blank state.

### 5. Document the Guardrail Rule

- Add a .mdc rule file (e.g., `.cursor/rules/compliance-checklist.mdc`) with `alwaysApply: true` in the frontmatter.
- Instruct the AI and users to read and truthfully answer the checklist before any push or critical action.

### 6. (Optional) Add a Pre-Push Git Hook

- Add a git pre-push hook to run the guardrail script automatically, blocking non-compliant pushes.

## Example Files

- `.compliance-checklist.md`: The checklist file.
- `scripts/ai-guardrail-check.js`: The enforcement script.
- `scripts/reset-compliance-checklist.js`: The reset script.
- `.cursor/rules/compliance-checklist.mdc`: The always-apply rule.

## Best Practices

- Automate as much as possible (test runs, secret scans, etc.).
- Require explicit, auditable confirmation for every compliance item.
- Reset the checklist after every push to prevent stale confirmations.
- Version all compliance actions and confirmations in git for traceability.
- Update the checklist and rules as project requirements evolve.

## How to Use This Prompt

- Copy this prompt into your project or AI agent as a reference.
- Follow the step-by-step instructions to implement a compliance guardrail system.
- Adapt the checklist and scripts to your project's specific compliance needs.
- Use the .mdc rule to ensure the AI always reads and enforces the checklist before critical actions.
