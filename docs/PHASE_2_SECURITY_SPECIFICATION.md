# MathsBridge Phase 2 Security Specification — Technical Review Draft

**Status:** Draft for technical and facilitator review — not approved for implementation  
**Phase:** Preparation only. Phase 2 has not been authorised or started.  
**Scope:** Security and data-integrity requirements for Phase 2 database foundations.  
**Authority:** This document records and cross-references existing requirements, identifies conflicts and proposes controls for review. It does not amend the PRD or Implementation Plan and does not approve new product requirements, schema fields, numerical thresholds, or security parameters.

## 1. PRD version and approval status

The repository contains one PRD file: `docs/PRD.md`. It identifies itself as **PRD v0.5**. The Implementation Plan records that the facilitator formally approved PRD v0.5 for implementation and marks that approval closed (Implementation Plan §18, row 1; also §18, row 18).

The PRD copy itself conflicts with that record. Its front matter and document details say “Draft — Pending Facilitator Approval”; its approval addendum says facilitator response has not been received; and its appendices retain pending facilitator/design approval statements (PRD front matter and document details; PRD Appendix A, H, L and N). The PRD also contains historical statements that the app and repository have not been built, which are stale relative to Phase 1 closure and the current repository.

**Finding:** v0.5 is the current PRD version named by the repository and Implementation Plan, but the repository documents do not agree on its approval status. This specification uses v0.5 as the requirements reference because it is the only PRD in the repository and the Implementation Plan records its approval. Facilitator confirmation or an authoritative status correction is still needed before treating the conflicting PRD status text as reconciled. This draft does not resolve that discrepancy.

The approved Stitch design status has a similar document conflict: Implementation Plan §18, rows 2 and 22 records the designs and Phase 1 token harmonisation as approved; Implementation Plan §§4.7, 7.1 and 7.3 and PRD Appendix L still describe designs/tokens as pending. Phase 2 must not use those stale statements to change approved design decisions. Pairing-screen visual design remains separately unresolved (Implementation Plan §18, rows 3 and 20).

**Section-reference note:** PRD §9 is “Design direction,” not security or permissions. The PRD permission matrix is §11.4 and its general security requirements are §12.3. This specification uses those actual PRD locations and the numbered SEC matrix in Implementation Plan §9. The Implementation Plan change log refers generally to Melsoft feedback, but the repository does not map any specific Melsoft comment to a Phase 2 security requirement; no additional requirement is inferred from that note.

## 2. Phase 2 boundary and environment

Phase 2’s documented purpose is to establish and test all PRD entities, constraints, RLS policies, trusted functions and fictional seed data before feature screens use them (Implementation Plan §13, Phase 2). It includes no feature screens; its frontend work is limited to typed Supabase client/configuration needed by later phases.

The repository records a separate, healthy MathsBridge-Dev cloud project (`dffcsmeewndzatxhfort`) in West EU (Ireland), linked using Supabase CLI 3.0.0. The original MathsBridge project is reserved for production and must remain untouched (Implementation Plan §18, row 19). The approved development workflow also specifies Supabase CLI with Docker for local development, SQL migrations in Git, and pgTAP tests (PRD Appendix H; Implementation Plan §§4.3–4.4).

**Environment question requiring an explicit operational decision:** Phase 2 says to reset “the database from empty state” but does not name the target (Implementation Plan §13, Phase 2, Step 4). The local workflow points to the local Docker database; PRD §11.7 also describes tests/demo against a development Supabase project. Before any destructive reset or hosted migration, identify the exact target and command. This document does not authorize a reset, migration, or other Supabase operation. The production project is never a Phase 2 target.

## 3. Existing approved security requirements

The requirements below are recorded in PRD v0.5 and/or the Implementation Plan. “Existing requirement” means text already present in those documents; this specification does not independently grant approval beyond the recorded approvals and decisions.

### 3.1 PIN, learner session and caregiver reset

| Existing requirement | Source |
| --- | --- |
| A learner creates a four-digit PIN after successful first pairing; later access uses profile selection plus PIN. | PRD Appendix C–D; Implementation Plan §4.5 and §18, row 7 |
| Never store a PIN in plain text. Use secure one-way hashing and trusted verification. | PRD Appendix D; Implementation Plan §4.5 |
| A learner session is scoped to that learner and cannot access another learner’s records. | PRD Appendix C–D; PRD §§2.4 and 11.4; Implementation Plan §§4.5 and 9 (SEC2, SEC14) |
| A caregiver can reset a learner PIN. | PRD Appendix C–D; Implementation Plan §4.5 and §18, row 7 |
| Failed PIN attempts require limits and temporary blocking. | PRD Appendix D; Implementation Plan §4.5 and §18, row 7 |

**Explicitly pending:** PIN hashing algorithm/parameters, PIN failed-attempt threshold, lockout duration, reset verification method, session expiry, and exact session invalidation behavior after reset. The PRD and Implementation Plan mark these details as unresolved (PRD Appendix D and M; Implementation Plan §18, rows 7–8 and build-blocking checklist). No parameter or field is selected here.

### 3.2 Pairing-code security

| Existing requirement | Source |
| --- | --- |
| Generate an eight-character random alphanumeric code, excluding O/0/I/1, using a cryptographically secure generator. | PRD Appendix E; Implementation Plan §4.5 and §18, row 6 |
| Store only a hash; never persist or log the raw code. | PRD Appendix E; Implementation Plan §4.5 |
| The code expires after 24 hours unused, is single-use, and is invalidated immediately after successful use. | PRD §§4.4 and 10.3; PRD Appendix C/E; Implementation Plan §§4.5, 8.3, 8.5, 18 row 6 |
| Failed attempts require rate limiting and temporary blocking. | PRD Appendix E; Implementation Plan §§4.5 and 18, row 6 |

**Explicitly pending:** pairing-code failed-attempt threshold and temporary-block duration. The code format, hash-only storage, single-use rule and 24-hour unused expiry are already specified; they are not open decisions.

### 3.3 Access control, data integrity and privacy

- Enable RLS on every app-accessible table and enforce access in PostgreSQL policies/functions, not only in frontend route logic. (PRD §12.3 and Appendix I; Implementation Plan §9.)
- Preserve each permission in the PRD permission matrix. The Implementation Plan labels these SEC1–SEC20 and assigns allow/deny test IDs. (PRD §11.4; Implementation Plan §9.)
- Attempt correctness and progress-relevant values must be calculated by trusted database logic. Attempts are immutable to app users. (PRD §§4.4, 11.4 and 12.3; Implementation Plan §§8.5 and 9, SEC14–SEC16.)
- Validate inputs in trusted functions/constraints; enforce published-content visibility and active caregiver–learner access as specified. (PRD §§4.4 and 11.4; Implementation Plan §§8–10 and 9.)
- Do not expose service-role credentials to browser code, Git, logs, tests or screenshots. Use ignored local environment values; `.env.example` must contain placeholders only. (PRD §11.5; Implementation Plan §6.)
- Use only fictional development/test records. Never use real learner or caregiver data or real passwords in tests. (PRD §10.4 and Appendix I; Implementation Plan §§8.7 and 12.4.)
- Caregiver consent is required before learner profile creation. Minimise child data; do not collect learner photos, precise location, audio or classroom recordings. Privacy/legal, retention/deletion wording and production-region gates remain outstanding for production or real-child use. (PRD §§12.3–12.4 and Appendix I; Implementation Plan §§4.7 and 18, row 13.)

### 3.4 Existing server-side rate limits

The PRD and Implementation Plan both specify a maximum of **20 answer submissions per learner per 10 minutes** and **5 feedback reports per learner per day**, enforced server-side (PRD §12.1; Implementation Plan §§8.5, 9 and 10, OP9/OP12). These are existing requirements, not proposals. Preserve both limits. They are distinct from the still-pending PIN and pairing-code failed-attempt thresholds and lockout durations.

## 4. Nine-entity schema boundary and unresolved fields

The approved model retains exactly these nine entities: Caregiver, Learner, CaregiverLearner, Topic, Lesson, PracticeQuestion, Attempt, HomeActivity and LessonFeedback (PRD §§10.1–10.2 and Appendix G; Implementation Plan §§4.6 and 8.1–8.2). Preserve existing field names/types, nullability, limits, defaults, relationships, uniqueness and delete behavior unless a documented change is approved.

Relevant existing fields in PRD §10.1 include:

- **Caregiver:** `id`, `full_name`, `email`, `created_at`.
- **Learner:** `id`, `display_name`, `grade`, `status`, `created_at`.
- **CaregiverLearner:** `id`, `caregiver_id`, `learner_id`, `pairing_code_hash`, `code_expires_at`, `status`, `created_at`.

The PRD requires PIN/session controls but does **not** define physical PIN/session column names, data types, nullability, defaults, constraints, or a session-storage representation. Its addendum and the Implementation Plan direct reviewers to incorporate the controls within the existing learner/access design and not add a tenth entity (PRD Appendix D/G; Implementation Plan §4.6 and §18, row 8). Those statements do not supply the missing field-level schema. No PIN/session fields are proposed in this draft.

**Additional schema reconciliation:** PRD §12.4 describes a consent record stored in Supabase PostgreSQL, while the nine-entity list in PRD §10.1 does not identify a consent entity or consent fields. The Plan’s nine-entity boundary does not resolve where that record is represented. Review this requirement and its storage location without silently adding an entity or field.

## 5. Learner creation and pairing transaction question

The documented flow says a signed-in caregiver enters a learner name and grade, after which MathsBridge creates the learner profile and one-time pairing code; the learner then enters that code and creates a PIN (PRD Appendix C; Implementation Plan §4.5). PRD §10.1 specifies that `CaregiverLearner.status` defaults to `Active`. The permission matrix says learner creation/update is for an authenticated caregiver with an active link (PRD §11.4; Implementation Plan §9, SEC3). The pairing/link rule separately requires an authenticated caregiver, a trusted database function, and a valid, unused and unexpired code (Implementation Plan §9, SEC6).

The documents do not fully specify the transaction boundary or the state sequence between learner creation, caregiver-link row creation, pairing-code state changes/redemption and learner-session establishment. In particular, it is unresolved how the active-link requirement for learner creation applies during that operation, including how the active link is available when the caregiver creates the learner.

**Question for technical/facilitator review:** Should the trusted operation create the learner, caregiver-link row and pairing-code state atomically, with all-or-nothing behavior? The row’s `Active` default is specified; the unresolved point is the transaction sequence and how the active-link requirement applies during creation. What exact relationship does successful code redemption establish for the learner session? Define rollback/concurrency behavior so the code cannot be redeemed twice, while preserving the approved single-use rule. These are questions, not decisions or proposed schema fields.

## 6. SEC1–SEC20 traceability and test expectations

PRD §11.4 contains the permission rows; PRD §12.3 supplies broader security rules. The **SEC numbering is supplied by Implementation Plan §9**, rather than appearing as numbered SEC identifiers in the PRD. The Plan maps each rule to an `a` allow and `b` deny test.

| Plan ID | Permission surface (summary) | Plan tests |
| --- | --- | --- |
| SEC1 | Caregiver reads/updates own record; auth ID immutable | T-SEC-1a/b |
| SEC2 | Learner read limited to linked caregiver/authorised learner session | T-SEC-2a/b |
| SEC3 | Learner create/update by an authenticated caregiver with an active link; permitted fields only | T-SEC-3a/b |
| SEC4 | Learner deletion only through trusted retention workflow | T-SEC-4a/b |
| SEC5 | Caregiver reads only own caregiver–learner links | T-SEC-5a/b |
| SEC6 | Authenticated caregiver creates the caregiver–learner link through a trusted database function; code must be valid, unused and unexpired | T-SEC-6a/b |
| SEC7 | Linked caregiver may perform only the unlink update | T-SEC-7a/b |
| SEC8 | Authenticated users read published topics only | T-SEC-8a/b |
| SEC9 | Topic writes/deletes are project-owner dashboard actions; app-client writes denied | T-SEC-9a/b |
| SEC10 | Authenticated users read published lessons only | T-SEC-10a/b |
| SEC11 | Lesson writes/deletes are project-owner dashboard actions; app-client writes denied | T-SEC-11a/b |
| SEC12 | Read only published questions for published lessons | T-SEC-12a/b |
| SEC13 | Question writes/deletes are project-owner dashboard actions; app-client writes denied | T-SEC-13a/b |
| SEC14 | Attempt reads limited to active linked caregiver/learner session | T-SEC-14a/b |
| SEC15 | Attempt creation through trusted logic; validate question and compute correctness server-side | T-SEC-15a/b |
| SEC16 | App users cannot update/delete submitted attempts | T-SEC-16a/b |
| SEC17 | Caregiver reads published home activities only | T-SEC-17a/b |
| SEC18 | Activity writes/deletes are project-owner dashboard actions; app-client writes denied | T-SEC-18a/b |
| SEC19 | Active learner context can create feedback with approved category/note constraints | T-SEC-19a/b |
| SEC20 | Feedback is readable/updatable/deletable only by project owner; not browsable by caregiver/learner | T-SEC-20a/b |

The Plan requires allow/deny tests for every row and specifically calls for cross-caregiver/unlinked-caregiver denial, RLS enabled checks, server-side rate limits, secret checks and client-supplied correctness denial (Implementation Plan §§9 and 13 Phase 2; PRD §§11.4 and 12.3). Tests should exercise the enforcement layer named for each rule: RLS, trusted function, restricted workflow or dashboard-only operation.

Add explicit persistence assertions for the existing secret-storage requirements, without assuming field names or hash parameters: **T-BR8-1** (existing pairing-code business-rule test) should verify the raw pairing code is not persisted and only its hash is stored; **T-DB-3** (new database invariant test ID) should verify learner PINs are never persisted in plaintext. T-DB-3 must not prescribe the field name, hash algorithm or parameters, which remain pending under §3.1. These assertions test existing requirements in PRD Appendix D/E and Implementation Plan §§4.5 and 9; they do not add new policy.

**Test design question:** For rules whose allowed action is “no app user” (SEC16) or “project owner via dashboard” (SEC9/11/13/18/20), the Plan’s generic allow/deny pair does not identify the positive test principal or method. Define how to test those intended boundaries without using a service-role/RLS-bypass path as evidence of an ordinary app-client policy allow. This clarifies test semantics; it does not weaken any permission.

Phase 2 also requires schema/constraint tests, business-rule boundary/invalid tests, all prior tests, and manual checks with two separate fictional caregivers; an unlinked caregiver must not read learner, attempts or feedback records (Implementation Plan §§12.2–12.5 and 13 Phase 2). Map all BR1–BR11 and the seven PRD §6.2 edge cases to exact test IDs before implementing affected rules (Implementation Plan §12.3). The expired/used pairing-code case is directly relevant to Phase 2; no exact T-EDGE identifier is yet assigned in the Phase 2 checklist.

## 7. Proposed technical controls for review — not approved requirements

The following are recommendations to guide technical review. They add no fields, fixed thresholds, hashing parameters, session duration or new product behavior.

1. **Keep privileged decisions server-side.** Route PIN verification, pairing-code redemption, attempt correctness, progress calculations, unlink and feedback-rate enforcement through the trusted database/server boundary specified by the Plan. Never accept correctness or authorization claims from the browser as authoritative.
2. **Make sensitive transitions atomic.** Review a transaction/locking approach for pairing-code redemption and learner/link creation so concurrent requests cannot consume a code more than once and partial creation does not leave an unintended access state. The exact workflow and state transition require approval under §5 above.
3. **Fail closed at the database boundary.** Test anonymous, authenticated-but-unlinked, linked caregiver, learner-scoped session and project-owner/dashboard contexts as applicable. Verify each role against the exact PRD permission; do not rely on hidden UI or routes.
4. **Minimise secret and child-data exposure.** Keep service-role credentials out of the browser and Git; do not log raw PINs, pairing codes, passwords, tokens or feedback notes. Use fictional data only. These controls restate existing security/privacy direction; logging specifics should be reviewed against the existing requirements.
5. **Separate destructive local tests from hosted development work.** Proposed default for repeatable reset/pgTAP work is the local Docker-backed database, consistent with the local workflow. Any hosted MathsBridge-Dev migration/reset requires an explicit target and operational approval. Never target the production-reserved MathsBridge project.
6. **Select hash and lockout parameters only after review.** Compare an appropriate one-way hash approach and deployment constraints for four-digit PINs; document algorithm parameters, attempt thresholds, lockout behavior, reset verification and session expiry only after security review. This specification deliberately does not choose values.

## 8. Approval register

| ID | Decision requiring review | Current status in repository | Review needed before |
| --- | --- | --- | --- |
| A1 | Reconcile PRD v0.5 facilitator approval status | Plan §18 says approved; PRD front matter/Appendix A/H/N says pending | Treating the file set as consistently approved requirements |
| A2 | Confirm PIN hash algorithm/parameters | Pending; no values specified | Implementing PIN storage or verification |
| A3 | Set PIN and pairing-code attempt thresholds and lockout durations | Pending; limits/temporary blocking required, exact values unspecified | Implementing attempt controls |
| A4 | Define learner-session expiry, scope representation and invalidation on reset | Scope to one learner is required; expiry and reset invalidation details pending | Implementing session storage or lifecycle |
| A5 | Define caregiver PIN reset verification | Caregiver reset is required; verification method pending | Implementing reset flow/function |
| A6 | Review exact PIN/session schema within the nine entities | No physical fields/types approved; no tenth entity | Writing schema migrations |
| A7 | Reconcile consent-record storage with nine-entity schema | PRD §12.4 describes a stored record; §10.1 has no consent entity/field | Finalizing consent-related schema |
| A8 | Approve learner + caregiver-link + pairing-code transaction/state sequence | Flow and active-link rule exist; transaction order and concurrency semantics are not specified | Implementing learner creation/pairing functions or SEC3/SEC6 policies |
| A9 | Confirm database reset and migration targets | Local Docker workflow specified; Phase 2 reset target is unnamed; MathsBridge-Dev is linked | Running any reset or hosted migration |
| A10 | Resolve privacy and production-release gate | Production-region confirmation, retention/deletion decisions and privacy/legal review remain outstanding (PRD §12.4; Implementation Plan §§4.7 and 18, row 13) | Hosted production use or processing real children's data |
| A11 | Define positive/negative test principals for dashboard-only/no-app-user SEC rules | Generic SEC allow/deny pairs exist; positive test method is unclear for SEC9/11/13/16/18/20 | Finalizing permission test harness |
| A12 | Reconcile stale design-approval/token text in PRD and Plan | Plan §18 records approval; PRD Appendix L and Plan §§4.7, 7.1, 7.3 retain pending/TODO text | Using stale design statements as a source for later UI work |
| A13 | Reconcile Supabase CLI version statements | Plan §18 row 19 records CLI 3.0.0; §§4.3–4.4 and row 10 still say version pending | Updating setup/runbook assumptions |
| A14 | Map the seven PRD §6.2 edge cases to exact test IDs | Plan §12.3 requires mapping; Phase 2 checklist does not assign exact T-EDGE IDs | Implementing each affected edge case |

Approvals should be recorded in the authoritative project records before the affected implementation begins. This register does not itself approve any item.

## 9. Phase boundary and security review gate

This specification is documentation preparation only. It does not authorize Phase 2, database changes, migrations, resets, hosted-project operations, feature screens or changes to the PRD/Implementation Plan. Phase 2 can begin only after explicit product-owner authorization as required by Implementation Plan §13 and §18. The production-reserved MathsBridge project remains untouched; no real learner data may be used.

