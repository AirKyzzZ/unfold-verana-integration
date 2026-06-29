# Verana × EUDIW Unfold — Integration Spec

**Status:** Active design (deep-spec, pre-build)
**Last updated:** 2026-06-29
**Owner:** Maxime Mansiet (Verana)
**Research backing:** [`docs/research/eudi-oid4vc-interop-profile.md`](../research/eudi-oid4vc-interop-profile.md) · [`docs/research/trust-registry-eudi-landscape.md`](../research/trust-registry-eudi-landscape.md)

---

## 1. Goal

Integrate **Verana** into France Identité's **EUDIW Unfold Playground** (`playground.france-identite.gouv.fr`, namespace `verana`). Per the requirement from Fabrice — *"au moins un issuer, un verifier, et Verana comme trust registry"* — the deliverable is the full **trust triangle**: an issuer, a verifier, and Verana as the trust registry vouching for both. The end-state is a marketplace card under **Online Verifiers** with a live, EUDI-interoperable `Test` at `https://api.playground.france-identite.gouv.fr/verana/verifier/` and proper `Docs`.

## 2. Strategic positioning (summary — full detail in the landscape research)

EUDI's native trust is **ETSI X.509 trusted lists + (emerging) OpenID Federation**. Two consequences:

- **Stay out of the qualified lane.** PID / QEAA / mDL are X.509 + ETSI-list only — no DID/TRQP hook. Verana must not pitch there.
- **Verana's lane = non-qualified EAAs** (org / professional / membership attestations), positioned as a **complementary governance/authorization layer** above ETSI enumeration and OIF discovery, answering *"is this issuer authorized to issue THIS schema under THIS framework?"* — never as a replacement for regulated trust.

**The wedge:** no EUDI pilot verifier today surfaces a **live trust-registry verdict inside the OID4VP flow**. Verana doing that in Unfold would be **first**. That is the headline. cheqd is the closest competitor but appears pre-deployment.

## 3. Core constraint — two stacks, and the resolver is the bridge

| | **Verana stack** | **EUDI / Unfold stack** |
|---|---|---|
| Transport | DIDComm | OID4VCI / OID4VP / DC-API |
| Formats | W3C VC + AnonCreds | SD-JWT VC, mdoc |
| Identity | DID (did:webvh) | X.509 (`x509_hash`), `iss` URL, IACA |
| Trust source | on-chain `Participant` permissions + ECS creds (TRQP) | ETSI X.509 trusted lists |

`vs-agent` is entirely the left column (Credo/Aries, DIDComm-only — **no OID4VP/OID4VCI/SD-JWT/mdoc**). The **only thing that bridges the two is the resolver/TRQP**: it resolves DIDs + on-chain permissions, independent of how a credential was exchanged. So Verana adds trust *behind* an EUDI verifier.

**HAIP is X.509-centric, so DID anchoring lives at the trust-registry layer, not in protocol fields:**
- **Issuer:** `iss = https://issuer.verana.<host>` (standard `/.well-known/jwt-vc-issuer`) **+** a matching `did:web:issuer.verana.<host>` with the same key → Verana resolves the DID from the `iss` host.
- **Verifier:** `client_id_scheme=x509_hash` X.509 cert carrying the Verana DID in a URI SAN → Verana cross-references cert → DID.
- Wallet key discovery stays `x5c`/HTTPS; **Verana is queried by our verifier after verification, never in the wallet's protocol path.**

## 4. Target architecture (Phase 2 end-state)

The EUDI-native triangle, Verana as registry:

```
  OID4VCI issuer (Credo)            OID4VP verifier (Credo)
  iss=https + did:web      ──┐   ┌── x509_hash cert + DID-in-SAN
        │ SD-JWT VC          │   │        │ DCQL / DC-API
        ▼                    ▼   ▼        ▼
   EUDI wallet (France Identité / EU ref) ── presents ──► verifier
                                                  │ extract issuer DID
                                                  ▼
                          Verana Trust Resolver (testnet, TRQP)
                          Q1 resolve · Q2 issuer-auth · Q3 verifier-auth
```

| Component | Role | Build vs reuse |
|---|---|---|
| `verana-verifier` (Credo OID4VP) | the marketplace card; verify presentation → trust check → verdict panel | **new** (Credo `@credo-ts/openid4vc`) + reuse `trust.ts` + panel |
| `verana-issuer` (Credo OID4VCI) | issue the Verana-anchored EAA SD-JWT VC into the wallet | **new** (Credo); can share one app with the verifier |
| Trust Resolver (TRQP) | trust verdicts | **consume** `resolver.testnet.verana.network/v1/trust` (don't deploy) |
| Verana identity | issuer/verifier DIDs + ECS + on-chain permissions | **mint via `vs-agent`** (transient), register via `veranad` |
| Marketplace card + docs | listing + dev docs | new, coordinated with France Identité |

**Resolver contract** (confirmed in `verana-resolver`): `GET /v1/trust/resolve?did=&detail=summary|full` (→ `TRUSTED`/`PARTIAL`/`UNTRUSTED` + `production`), `GET /v1/trust/issuer-authorization?did=&vtjscId=`, `GET /v1/trust/verifier-authorization?did=&vtjscId=`, `+ ecosystem-participant`, `+ refresh`.

**Security rules (non-negotiable):** fail closed (404/error never → trusted); trust queries use the cryptographically validated DID, never a raw param; checks run server-side; no custom crypto (Credo does verification).

## 5. Multi-step integration plan

Phase 1 is the **basic Verana-stack integration** (fast, reusable foundation); Phase 2 is the **EUDI OpenID integration** (the strategic prize). Phase 1 is a stepping stone — **hold the public marketplace card until Phase 2** so Verana's first impression is EUDI-interoperable.

### Phase 0 — Gov pipeline validation
- **Objective:** prove GitLab → Kaniko → Harbor → ArgoCD → Istio in the `verana` namespace.
- **Steps:** deploy the `hello-world` starter (app repo + helm repo) → reach `api.playground.france-identite.gouv.fr/verana/hello-world/`.
- **Reuse:** the France Identité starter kit as-is.
- **Exit:** 200 from the public URL.

### Phase 1 — Verana foundation + basic DIDComm triangle
- **Objective:** stand up the Verana trust layer and a working (DIDComm) trust triangle; build the foundation every later phase reuses.
- **Steps:**
  1. **On-chain (testnet):** create the Unfold **ecosystem → Trust Registry → EAA credential schema (`vpr:verana:vna-testnet-1:cs:N`) → VTJSC → ECOSYSTEM root permission** (`veranad`, reuse `hologram-verifiable-services` / MOSIP scripts).
  2. **Identities:** mint issuer DID (`did:webvh`) + verifier DID via `vs-agent`; attach ECS-SERVICE + ECS-ORG creds; create **ISSUER** + **VERIFIER** `Participant` permissions on-chain.
  3. **Trust layer:** wire the verdict engine (`trust.ts`) + trust panel against the testnet resolver.
  4. **(Optional) DIDComm demo:** issue the EAA to a Hologram wallet → present → render the verdict + a counter-example UNTRUSTED DID.
- **Reuse:** `vs-agent-chart`, `veranad` flows, `trust.ts`, the MOSIP trust panel.
- **Exit:** resolver returns TRUSTED + accredited/authorized for the issuer/verifier DIDs; (optional) DIDComm triangle works end-to-end on testnet.

### Phase 2 — EUDI OpenID integration with Credo (the prize)
- **Objective:** make issuer + verifier EUDI-native so the real FI / EU wallets interoperate, with Verana as trust registry — the marketplace card.
- **Steps:**
  1. Build a standalone **Credo agent** (`@credo-ts/openid4vc`): **OID4VCI issuer** (SD-JWT VC) + **OID4VP verifier** (OID4VP 1.0, DCQL, DC-API `dc_api.jwt`, `client_id_scheme=x509_hash`).
  2. **Issuer binding:** `iss = https://issuer.verana.<host>` + matching `did:web:<host>` (same key) → reuse the Phase 1 schema/VTJSC + ISSUER permission.
  3. **Verifier binding:** x509 cert (`x509_hash`) with the Verana DID in a URI SAN → reuse the Phase 1 VERIFIER permission.
  4. **Trust panel:** verifier maps issuer `iss` → DID, calls resolver Q1/Q2; resolves its own DID Q1/Q3 ("verify the verifier"); render verdict. Reuse `trust.ts`.
  5. **Deploy** as `verana-verifier` (+ issuer) at `/verana/verifier/` (+ `/verana/issuer/`) via the Phase 0 pipeline; set `PUBLIC_BASE_URL` for the Istio base-path rewrite.
  6. **Interop test** with the France Identité wallet (or EU ref wallet): receive the Verana-anchored SD-JWT VC (OID4VCI) → present (OID4VP/DC-API) → see the live Verana verdict.
- **Reuse:** everything from Phase 1 except the exchange protocol; Credo for the OID4VC machinery.
- **Exit:** an EUDI wallet completes issue → present → live trust verdict end-to-end against our services.

### Phase 3 — Marketplace listing + docs
- **Objective:** Verana's card in the Unfold marketplace.
- **Steps:** author the marketplace Markdown (logo, description, tech specs, `Open Verifier` → `/verana/verifier/`); write Verana developer docs (TRQP model + how other playground verifiers could call Verana); request France Identité to add the card (listing is **human-gated**).
- **Exit:** Verana listed under Online Verifiers with `Docs` + `Test`.

### Phase B — real France Identité PID (later, out of scope)
A real FI PID is mdoc, issuer = IACA/X.509, **no DID** — mapping it to Verana is a spec/governance workstream (identifier bridge + "is Verana authoritative for FI's PID?"). Not part of this milestone.

## 6. Deployment model

- **Two-repo pattern** per France Identité conventions: app repo (`Dockerfile`, Kaniko `.gitlab-ci.yml` → Harbor `tools.playground.france-identite.gouv.fr/verana/...`) + Helm repo (Deployment + Service + Istio `VirtualService`, ArgoCD-reconciled).
- **Deploy only the app(s)** into `verana`; consume the public testnet for all trust infra (the resolver needs Postgres+Redis+Indexer+chain — don't host that in the gov cluster).
- **Istio base-path gotcha:** `/verana/<slug>/` is rewritten to `/`. All wallet-facing URLs (OID4VP `response_uri`, request object, verifier metadata, DID/issuer endpoints) must use an explicit `PUBLIC_BASE_URL`, never inferred. Most likely silent failure — design for it.
- Image registry → Harbor + `imagePullSecret`; storage class per the gov cluster.

## 7. Verana on-chain trust data (testnet)

Create on `vna-testnet-1`: Corporation → Trust Registry (ecosystem DID + EGF) → Credential Schema (the EAA's JSON Schema) → VTJSC (ecosystem-signed `JsonSchemaCredential`, its URL = `vtjscId`) → ECOSYSTEM root Participant → ISSUER + VERIFIER Participants. Permissions go `ACTIVE` after ~21 blocks. The resolver is format-agnostic, so the SD-JWT VC `vct` maps to this schema/VTJSC via config in our verifier.

## 8. Reuse map (real repos)

**Lift:** `mosip-playground/playground/app/lib/trust.ts` (verdict engine, fail-closed), `…/app/config.ts` structure, `…/inji-verify-ui/public/verana-trust-panel.js` (hook-and-render pattern), `hologram-verifiable-services/common/common.sh` + `avatar/scripts/setup.sh` (`vs-agent` provisioning + on-chain registration), MOSIP `.github/workflows/1_*.yml` (helm + `veranad` pattern), `integration-sandbox/mosip` phase-runbook format.
**Build new:** the Credo OID4VCI issuer + OID4VP verifier; SD-JWT VC handling; the DID↔x509/HTTPS binding; Istio base-path config; the marketplace Markdown.
**Identity only (not the exchange engine):** `vs-agent` (DIDComm).

## 9. Open decisions & dependencies

- **Positioning sign-off (Fabrice / Ariel):** confirm "non-qualified EAA + complementary-to-ETSI/OIF + own the live-verdict wedge." Ariel's OpenID Federation vantage matters.
- **Demo EAA (product):** which non-qualified attestation to anchor (org / professional / membership).
- **Credo hosting:** standalone Credo app first (decided); upstreaming OpenID4VC into `vs-agent` is the later product play.
- **FI wallet confirmations:** HAIP draft level; that the sandbox accepts a third-party `vct` via OID4VCI external issuance (sandbox is permissive; to verify empirically).
- **Demo honesty:** the FI wallet does not call Verana — our verifier computes the verdict. The demo proves "trust at the verifier"; wallet-side enforcement is the adoption roadmap.

## 10. Risks

- **Protocol gap is structural** — every EUDI-facing piece is net-new; only the trust layer reuses Verana.
- **Qualified stack is x509-only** — no DID hook; stay in the EAA lane.
- **"Permissionless registry" governance optics** under eIDAS — complementary framing, not a trust replacement.
- **OpenID Federation** may be normalized in the 2026 ARF round, shrinking out-of-band TRQP need in EU-perimeter cases.
- **Base-path / OID4VP redirect** under Istio rewrite.
- **Listing is human-gated** by France Identité.
- **Phasing drift** — Phase 1 must not become the end state; the value is in Phase 2.

## Appendix — confirmed facts

- **Resolver:** `resolver.testnet.verana.network/v1/trust` (Fastify on `@verana-labs/verre`; routes Q1–Q5; no auth; fail-closed). Network `vna-testnet-1`; endpoints `rpc/api/idx/resolver.testnet.verana.network`.
- **vs-agent:** Credo-TS/Aries; DIDComm + AnonCreds + JSON-LD; admin :3000 / didcomm :3001; chart `oci://…/veranalabs/vs-agent-chart` (image v1.9.1). No OID4VP/OID4VCI/SD-JWT/mdoc.
- **Credo `@credo-ts/openid4vc`:** OID4VP 1.0 + DCQL + DC-API (`dc_api.jwt`) + SD-JWT VC + mdoc + `x509_hash`; OID4VCI pre-auth + auth-code. (See interop research.)
- **Playground:** `https://api.playground.france-identite.gouv.fr/{entity}/{slug}/`; GitLab(Kaniko)→Harbor→ArgoCD→Istio. Marketplace categories: Wallets / Online Verifiers / Proximity Verifiers / Issuers / Conformance (no trust category → list under Online Verifiers).
- **EUDI profile:** HAIP, OID4VP 1.0, DCQL, DC-API, SD-JWT VC + mdoc, ES256, verifier `client_id_scheme=x509_hash`. (See interop research.)
