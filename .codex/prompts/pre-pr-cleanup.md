# Pre-PR Cleanup Prompt

Use this prompt as a separate pass before every PR in Mosaic.

Review only the touched files. Simplify the branch until the diff is the smallest version that still solves the problem.

Apply these rules:

- Make the code skimmable on first read.
- Prefer fewer lines of code.
- Remove changes that are not strictly required.
- Reduce possible states by narrowing types, inputs, and branching.
- Use discriminated unions for objects with multiple valid shapes.
- Exhaustively handle known variants and fail on unknown type.
- Do not write defensive code for states that the types already exclude.
- Use asserts when required data must exist.
- Do not keep optional arguments if they are actually required.
- Keep argument counts low.
- Avoid override-heavy APIs unless they are truly necessary.
- Prefer early returns.
- Do not split code into many tiny helpers if it makes the flow harder to read.
- Remove clever code.

When the pass is done:

1. List the concrete simplifications you made.
2. Call out any remaining complexity that is still justified.
3. Say explicitly if the diff is clean enough for PR.
