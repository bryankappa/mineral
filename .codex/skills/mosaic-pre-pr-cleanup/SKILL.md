---
name: mosaic-pre-pr-cleanup
description: Run before every Mosaic PR. Use to simplify the diff, remove non-essential changes, and enforce skimmable code standards.
---

# Mosaic Pre-PR Cleanup

Run this as a separate pass before opening a PR.

Use `.codex/prompts/pre-pr-cleanup.md` as the prompt for the cleanup pass.

## Cleanup Goals

- Remove changes that are not required.
- Make the final diff smaller and easier to skim.
- Reduce the number of states the code can be in.
- Replace vague object shapes with discriminated unions when needed.
- Replace defensive code with asserts when the value must exist.
- Remove optional parameters that are not truly optional.
- Collapse unnecessary helpers and overrides.
- Keep the happy path obvious.

If the cleanup pass finds no meaningful simplification, say so explicitly.
