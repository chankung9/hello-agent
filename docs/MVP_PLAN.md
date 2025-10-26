# hello-agent MVP Plan

## 1. Purpose & Context
- **Objective:** Deliver a documented handshake between `codex-agent` HQ and the downstream `hello-agent` repo that outlines scope, milestones, and owners for the MVP integration.
- **Success Criteria:**
  - Plan approved by Product, Finance, and HR reviewers.
  - Integration checklist in `docs/INTEGRATION_HELLO_AGENT.md` reflects the drafted plan.
  - Audit log captures kickoff plus approvals for traceability.

## 2. Scope
### In-Scope Deliverables
1. Documented workflow for syncing plans between repos.
2. Definition of reporting cadence (weekly product review, monthly finance snapshot).
3. HR inclusion guidelines for performance tracking and staffing.
4. **Reference implementation:** Web frontend demo that renders "HelloWord" centered on screen with animated letters that move/bounce when hitting viewport edges (see Example Deliverable below).

### Out-of-Scope (MVP)
- Automated deployment or bot-driven synchronization.
- Budget approvals beyond the MVP monitoring window.
- Security automation changes outside manual checklist alignment.

## 3. Milestones & Timeline
| Milestone | Owner | Target Date | Notes |
| --- | --- | --- | --- |
| MVP plan drafted & filed (`projects/hello-agent/docs/MVP_PLAN.md`) | Engineer Agent | 2025-10-25 | Current document |
| Product review + feedback incorporated | Product Agent | 2025-10-27 | Required for `pipeline.yaml` product_review gate |
| Finance review & budget note | Finance Agent | 2025-10-28 | Confirms no incremental spend beyond monitoring |
| HR tracking update | HR Agent | 2025-10-28 | Ensures performance metrics capture cross-team effort |
| Integration checklist closure | Engineer Agent | 2025-10-29 | Flip outstanding checklist items once validations done |

## 4. Roles & Responsibilities
- **Engineer Agent:** Own documentation updates, integration tests, and audit entries.
- **Product Agent:** Validate scope, provide roadmap alignment, sign off on product_review gate.
- **Finance Agent:** Confirm financial coverage and update `finance/` summaries if needed.
- **HR Agent:** Track contributors, staff planning, and ensure retrospectives capture learnings.
- **Compliance Agent (support):** Review audit entries and release checklist mapping.
- **Engineering Lead (software design authority):** All software design/solution/technology decisions for the hello-agent web frontend reside solely with the Engineer Agent to keep ownership clear.

## 5. Dependencies & Inputs
- `.codex/plan.yaml` — defines orchestration steps (`hello_agent_mvp_plan`).
- `pipeline.yaml` — specifies gates (product_review, finance_review) applicable to this effort.
- `docs/deployments/HELLO_AGENT_MVP_DPD.md` — deployment guardrails and rollback strategy.
- `audit/logs/2025-10-25.md` — authoritative record for approvals.

## 6. Implementation Workstreams
| Workstream | Description | Tasks | Owner | Status / Evidence |
| --- | --- | --- | --- | --- |
| A. MVP Plan Drafting | Maintain and iterate on `hello-agent/docs/MVP_PLAN.md` with stakeholder feedback. | Track comments, capture decisions, keep milestones updated. | Engineer Agent | In progress — v1 drafted 2025-10-25; future edits gated by weekly product reviews. |
| B. Doc Sync Validation | Ensure bidirectional sync between `codex-agent` HQ and the hello-agent repo. | Follow `projects/hello-agent/docs/DOC_SYNC_CHECKLIST.md`, log evidence in audit file. | Engineer Agent | Checklist operational with helper script `projects/hello-agent/scripts/doc_sync_diff.sh`; last run logged 2025-10-25 10:30 UTC. |
| C. Reporting Alignment | Map MVP metrics to finance + release reporting templates. | Update `reports/` summaries, confirm gates in `pipeline.yaml`. | Product & Finance Agents | Baseline mapping completed 2025-10-25; see `reports/README.md` “hello-agent MVP Reporting Alignment”. |
| D. HR & Compliance Tracking | Keep staffing/performance notes and compliance hooks current. | Update HR prompt/logs, align with `docs/RELEASE_CHECKLIST.md`. | HR & Compliance Agents | Addendum for hello-agent MVP appended to `docs/RELEASE_CHECKLIST.md`; tracking call-outs logged 2025-10-25. |
| E. Frontend Prototype | Build and verify the HelloWord animation demo (see Example Deliverable). | Design UX, select tech stack, implement animation, capture test evidence | Engineer Agent | Pending — requires downstream repo implementation |

## 7. Architecture Overview (Engineer-owned)
- **Client Application:** Single-page web frontend (HTML/CSS/JavaScript or preferred framework) hosted from the hello-agent repo. No backend dependencies for MVP.
- **Animation Engine:** Canvas/WebGL or DOM-based animation loop controlled via `requestAnimationFrame`. Each character becomes an independent sprite with position + velocity vectors.
- **State Management:** Lightweight module storing letter metadata (`[{ char: 'H', position: {x,y}, velocity: {vx,vy}}]`). Collision detection happens per frame against viewport bounds; when a letter hits an edge, invert the relevant velocity component.
- **Build/Tooling:** Use a minimal bundler (Vite/Parcel/Rollup) or plain ES modules. Decisions reside solely with the Engineer Agent; document the toolchain in the downstream repo README.
- **Testing & Evidence:** Provide a simple playwright/cypress or manual checklist verifying the animation plus capture a short recording (GIF/video) for reports.

## 8. Example Deliverable — HelloWord Frontend
- **Goal:** Provide a concrete test artifact to prove the MVP workflow can deliver working software.
- **Requirements:**
  1. Web frontend displaying the string **"HelloWord"** centered on the screen.
  2. Each letter animates, moving across the viewport and bouncing in the opposite direction whenever it hits a screen edge.
  3. Implementation details (framework choice, animation technique) decided solely by the Engineer Agent to maintain clear ownership.
  4. Include README/test notes describing how reviewers can run the demo and observe the bouncing behavior.
- **Validation:** Record GIF/video or screenshots plus console output showing the animation, and store the evidence link in `reports/releases/summary/SUMMARY-2025-10.md` or subsequent summaries when shipped.

## 9. Risks & Mitigations
| Risk | Impact | Mitigation |
| --- | --- | --- |
| Review delays block release readiness | Medium | Pre-schedule reviewer slots; capture async approvals in audit log |
| Scope creep beyond MVP | Medium | Keep out-of-scope list visible; escalate via Product Agent |
| Missing compliance trail | High | Update audit log immediately after key actions |

## 10. Validation & Exit Criteria
- Integration checklist items marked complete once plan + validation steps are performed.
- Product/Finance/HR approvals documented in audit log.
- Any follow-up tasks captured in `projects/hello-agent/tasks/` for post-MVP iterations.

## 11. Review & Sign-off
| Role | Reviewer | Status | Evidence |
| --- | --- | --- | --- |
| Product | Product Agent | Approved | audit/logs/2025-10-25.md |
| Finance | Finance Agent | Approved | audit/logs/2025-10-25.md |
| HR | HR Agent | Approved | audit/logs/2025-10-25.md |
