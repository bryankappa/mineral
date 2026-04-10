---
name: mosaic-foundation
description: Build Mosaic as the shared Databricks commercial AWS foundation for production-grade RAG and agentic GenAI workloads. Use before implementation in this repo.
---

# Mosaic Foundation

Mosaic exists to give delivery teams one reusable, production-grade starting point for Databricks work on AWS.

## Use This Skill For

- RAG foundations
- agentic workflow foundations
- Databricks-native integration patterns
- shared deployment and configuration patterns
- reusable building blocks that should survive across engagements

## Working Model

Start from the smallest official Databricks skill set that fits the task:

- `databricks-core` for CLI, auth, discovery, and bundles
- `databricks-apps` for Apps and AppKit work
- `databricks-jobs` for Lakeflow Jobs
- `databricks-lakebase` for Lakebase
- `databricks-pipelines` for DLT and streaming pipelines

Do not build one-off engagement code if the pattern should live in the shared foundation.

## Code Standards

- Write code that is easy to skim.
- Prefer fewer lines and fewer moving parts.
- Keep argument counts low.
- Do not make arguments optional when they are required.
- Reduce state aggressively.
- Use discriminated unions when data can be one of several known shapes.
- Exhaustively handle each known shape and fail on unknown type.
- Use asserts when loading required data or checking invariants.
- Do not add defensive branches for impossible states.
- Prefer early returns.
- Avoid thin helper layers that make the flow harder to follow.
- Remove changes that are not strictly required.

## Design Bias

The foundation should make the common path obvious:

- standard LLM integration
- standard vector search wiring
- standard agent orchestration seams
- standard configuration shape
- standard deployment path

Every new abstraction should make delivery faster for the next team, not just the current one.

## Before PR

Run `.codex/skills/mosaic-pre-pr-cleanup/SKILL.md`.
