# Doc Sync Validation Checklist — hello-agent

Use this checklist whenever verifying that documents stay consistent between the `codex-agent` HQ repo and the downstream `hello-agent` sandbox.

## Prerequisites
- Access to both repositories (local clones or synced workspace).
- Pending changes committed or stashed to avoid noise.

## Steps
1. **Fetch Latest Sources**
   - HQ: `git -C /path/to/codex-agent pull`
   - Sandbox: `git -C /path/to/hello-agent pull`
2. **Identify Target Docs**
   - Default set: `projects/hello-agent/docs/MVP_PLAN.md`, integration notes, and any linked release/deployment files.
3. **Run Diff Review**
   - Preferred: `projects/hello-agent/scripts/doc_sync_diff.sh /path/to/hello-agent`
   - Manual fallback: `diff -ruN /path/to/codex-agent/projects/hello-agent/docs /path/to/hello-agent/docs`
   - Confirm intentional changes exist in both repos.
4. **Update Missing Files**
   - Copy or cherry-pick updates downstream/upstream as needed.
5. **Record Evidence**
   - Add audit entry summarizing the sync test (timestamp, owner, scope).
   - Reference this checklist to prove repeatability.

## Exit Criteria
- No unexpected diffs between repos for the targeted docs.
- Audit log updated with test details.
- Integration checklist (if applicable) marks the doc-sync step complete.
