# Verana × EUDIW Unfold, Integration Spec

**Status:** Active, S1 (registry-first trust playground) locked, building
**Last updated:** 2026-07-02
**Owner:** Maxime Mansiet (Verana)
**Research:** [`docs/research/trust-registry-eudi-landscape.md`](../research/trust-registry-eudi-landscape.md) · [`docs/research/eudi-oid4vc-interop-profile.md`](../research/eudi-oid4vc-interop-profile.md)
**Deploy runbook:** [`phase-0-pipeline-mvp.md`](phase-0-pipeline-mvp.md)

---

## 1. Goal

Put Verana on France Identité's **EUDIW Unfold Playground** (`playground.france-identite.gouv.fr`, namespace `verana`) as a **Conformance** marketplace card, a `Docs` + `Test` entry where **Test opens a trust playground** demonstrating Fabrice's requirement: *"au moins un issuer, un verifier, et Verana comme trust registry."* An issuer and a verifier exist as registered Verana services, and Verana (the trust registry) vouches for both, live.

**Phasing decided:** ship **S1** (registry-first trust playground, existing Verana stack, no wallet, no Credo) → appear on the marketplace and prove the playground works → **then** go deeper on live issuance + EUDI-wallet support (Credo/OID4VP).

## 2. Positioning (summary, full detail in the landscape research)

EUDI's native trust is ETSI X.509 trusted lists + OpenID Federation; Verana stays out of the qualified lane (PID/QEAA/mDL) and plays the **non-qualified EAA** space as a **complementary trust layer**. The wedge: **no EUDI verifier surfaces a live trust-registry verdict today**, Verana doing it in Unfold is first. Listing under **Conformance** (next to FIME) is the honest home for a trust-*testing* tool, and matches "test what Verana can do in terms of trust."

## 3. How Verana vouches (the trust model)

Verana = a **Verifiable Public Registry** (Cosmos chain) + a **Trust Resolver** speaking TRQP. Trust is on-chain: an **ecosystem** owns a **credential schema** (`vpr:verana:<net>:cs:<id>`) bound to a **VTJSC**, and **Participant permissions** (ISSUER / VERIFIER / …) say who may issue or request it. The resolver answers, format-agnostically, over a DID:

```
Q1 GET /v1/trust/resolve?did=                       → TRUSTED | PARTIAL | UNTRUSTED (+ production)
Q2 GET /v1/trust/issuer-authorization?did=&vtjscId= → authorized?   (verify the issuer)
Q3 GET /v1/trust/verifier-authorization?did=&vtjscId=→ authorized?   (verify the verifier)
```
Public testnet resolver: `resolver.testnet.verana.network/v1/trust` (CORS-open, fail-closed).

## 4. S1 architecture, registry-first trust playground

Two parts, both on the existing Verana stack. **No wallet, no live credential exchange, no Credo**, the star is the live trust verdict.

**A. On-chain (Verana testnet `vna-testnet-1`), a fresh "Unfold" ecosystem:**
- ecosystem / Trust Registry (Unfold demo) → an **EAA credential schema** + VTJSC → ECOSYSTEM root permission
- an **issuer** verifiable service (DID + ECS + ISSUER permission)
- a **verifier** verifiable service (DID + ECS + VERIFIER permission)

**B. The playground web app** (deployed at `/verana/…` via the validated pipeline):
- a guided story flow: the triangle (issuer → verifier → Verana registry) with **live** checks, Q1/Q2 on the issuer DID ("accredited?"), Q1/Q3 on the verifier DID ("authorized?")
- a free **"resolve any DID"** tester (the MVP's Check-trust widget, grown up)
- a **counter-example** untrusted DID for contrast
- fail-closed verdicts, org identity surfaced from ECS

**Reuse (~80%, from the shipped `mosip-playground`):** `app/lib/trust.ts` (verdict engine), `app/config.ts` structure (swap to Unfold DIDs/ecosystem/vtjscId), the trust panel + verdict components (`ResolverVerdict`, `TrustCard`, `PermissionTree`, `TrustDiagram`), the story-flow page pattern, and the `vs-agent` + `veranad` registration scripts (`hologram-verifiable-services`, MOSIP workflows). **New:** Unfold re-skin/branding, the Conformance framing, fresh ecosystem data, the marketplace Markdown.

## 5. S1 build plan

| Step | Deliverable | Needs |
|---|---|---|
| **S1.0** | MVP live at `/verana/verana/` (proves pipeline + cluster→testnet egress) | **ArgoCD** URL + token (or you Sync in UI), image already built & in Harbor |
| **S1.1** | Fresh Unfold ecosystem + EAA schema + issuer DID + verifier DID registered on testnet | a Verana **testnet account mnemonic**; `vs-agent` + `veranad` (reuse MOSIP scripts) |
| **S1.2** | The trust playground web app (story flow + live checks + resolve-any-DID + counter-example), adapted from `mosip-playground` | none (frontend; I can start now against the testnet resolver + placeholder DIDs, wire real DIDs after S1.1) |
| **S1.3** | Deploy the playground at `/verana/<slug>/` via the two-repo pipeline | pipeline (done) + ArgoCD |
| **S1.4** | Marketplace card: Docs (→ Verana trust docs) + Test (→ playground); request France Identité to add it under **Conformance** | France Identité coordination (listing is human-gated) |

## 6. Later (deferred, the upgrade path)

- **S2, live DIDComm exchange:** run a real issuance + presentation via the vs-agent issuer/verifier + a Hologram wallet, trust panel on top. Makes the triangle "really run," still non-EUDI wallet.
- **S3, EUDI-native (Credo):** OID4VCI issuer + OID4VP verifier so a real France Identité wallet presents into the triangle (HAIP: `x509_hash`, DCQL, DC-API, SD-JWT VC; DID anchoring at the registry layer). This is where Credo earns its place. Details in the interop research.

## 7. Deploy model (validated)

Two-repo pattern under `plg/partners/verana`: app repo (`Dockerfile`, Kaniko `.gitlab-ci.yml` → Harbor `tools.playground.france-identite.gouv.fr/verana/<name>`, pushes `:<sha>` + mutable `:latest`) + Helm repo (Deployment + Service + Istio `VirtualService`, ArgoCD-watched). Only the app deploys into `verana`; all trust infra is the public testnet. Istio rewrites `/verana/<slug>/`→`/`, so `vite base` === `istio.pathPrefix` (static SPA). **Status: GitLab + Harbor proven** (pipeline #1642 pushed `verana/verana:latest`); **ArgoCD is the open leg.**

## 8. Open dependencies

- **ArgoCD access**, URL + token (or you Sync), to make anything appear at `/verana/…`.
- **Testnet account mnemonic**, to register the Unfold ecosystem + issuer/verifier on-chain (S1.1).
- **EAA choice**, which non-qualified attestation the issuer issues (default proposal: an "accredited organization" credential; alternatives: professional license / membership).
- **France Identité**, confirm a Conformance listing and author the card from our Markdown.

## 9. Risks

- Listing is **human-gated** by France Identité.
- S1 is deliberately a **MOSIP-style trust showcase repositioned under Conformance**, honest and fast, but the EUDI-wallet-interop story only arrives with S3 (Credo). Keep that as the roadmap, not a hidden gap.
- **Base-path / egress** are the two integration unknowns S1.0 flushes out early.

## Appendix, status & facts

- **Done:** public repo, spec + research, Phase 0 MVP (Vite trust-check app + Helm), GitLab projects `verana` + `helm-verana` created & pushed, pipeline **#1642 succeeded** (image `verana/verana:latest` live in Harbor).
- **Resolver:** `resolver.testnet.verana.network/v1/trust`; network `vna-testnet-1`; `idx/rpc/api.testnet.verana.network`.
- **vs-agent:** DIDComm/Aries, chart `oci://…/veranalabs/vs-agent-chart`, admin :3000 / didcomm :3001 (identity/registration only, not the exchange engine).
- **Playground:** `https://api.playground.france-identite.gouv.fr/{entity}/{slug}/`; categories Wallets / Verifiers / Issuers / Proximity / **Conformance**.
