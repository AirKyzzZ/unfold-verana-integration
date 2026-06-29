# EUDI OID4VC Interop Profile — research findings

**Date:** 2026-06-29
**Purpose:** Technical reference for building a Credo-TS OID4VCI issuer + OID4VP verifier that interoperates with the France Identité / EU reference wallet in the EUDIW Unfold playground, while anchoring issuer/verifier identity in Verana (DID + on-chain permissions).
**Headline:** **HAIP — the profile the EUDI wallets follow — is X.509-centric, not DID-centric.** DID anchoring must live at the trust-registry layer, not in OID4VC protocol fields. Credo-TS supports everything needed.

---

## 1. OID4VP profile the FI wallet expects

| Dimension | Value |
|---|---|
| OID4VP version | **1.0 (final, July 2025)** — not a numbered draft |
| Query language | **DCQL (mandatory under HAIP)**; `presentation_definition` still works but is not the HAIP path |
| Transport | **W3C Digital Credentials API (DC API)**, `response_mode=dc_api.jwt` — **Chromium-only**. Cross-device QR / `direct_post.jwt` also exist in OID4VP 1.0 |
| Credential formats | **`dc+sd-jwt` (SD-JWT VC)** and **`mso_mdoc` (ISO 18013-5/7)** — EUDIW mandates both for full compliance |
| Signing | ES256 (P-256) minimum |

## 2. `client_id_scheme` — the DID blocker

**HAIP draft 05 mandates `x509_hash` exclusively** ("the Verifier MUST use, and the Wallet MUST accept the Client Identifier Prefix `x509_hash`"; `x509_san_dns` and `verifier_attestation` were removed). `client_id_scheme=did` is **not** HAIP-accepted — a strict HAIP wallet (the FI wallet is HAIP-aligned) will reject it.

**Consequence:** the verifier's OID4VP `client_id` is an **X.509 certificate**, not the Verana DID. In Credo: `OpenId4VcJwtIssuerX5c` with `clientIdPrefix: 'x509_hash'`. The Verana DID can be carried in the cert's URI SAN for registry cross-reference.

## 3. SD-JWT VC issuer identity with a DID

- Base SD-JWT VC spec: `iss` **MUST be an HTTPS URL** (key discovery via `/.well-known/jwt-vc-issuer`) or X.509 via `x5c`. **No DID mechanism is defined.**
- HAIP removes the HTTPS-only constraint on `iss`, but key discovery is still via **`x5c`**, not DID resolution. A wallet seeing `iss: did:...` will not resolve a DID document for the key.
- **Verdict:** a `did:webvh` cannot be the *protocol* issuer identifier in a HAIP flow. The DID is a **trust-registry anchor**, not a protocol field.

## 4. The binding pattern (how Verana still anchors trust)

DID anchoring happens at the **trust-registry layer**:

- **Issuer:** `iss = https://issuer.verana.<host>` (standard `/.well-known/jwt-vc-issuer`), **plus** publish `did:web:issuer.verana.<host>` with the same key. The `did:web` domain == the `iss` host, so Verana resolves the DID directly from the credential's issuer URL.
- **Verifier:** `client_id_scheme=x509_hash` with an X.509 cert; embed the Verana DID as a **URI SAN** in the cert. Verana cross-references cert-hash → DID.
- Wallet-side key discovery stays `x5c`/HTTPS. **Verana is queried by our verifier after verification — never in the wallet's protocol path.**

## 5. OID4VCI external issuance into the FI wallet

- Pre-authorized **and** authorization-code flows both defined; the Unfold playground lists "OID4VCI external issuance" as supported.
- Custom `vct` (SD-JWT VC type) is allowed at protocol level. The **sandbox is permissive**; **production EUDIW wallets are expected to gate issuance on issuer trusted-lists** (ARF governance). Whether the FI sandbox silently drops unknown-issuer credentials is **not documented** — to confirm empirically.

## 6. HAIP mandate summary

| Dimension | HAIP 1.0 draft 05 |
|---|---|
| Formats | ≥1 of `dc+sd-jwt` / `mso_mdoc` (ecosystem-defined; EUDIW = both) |
| OID4VP | 1.0 final |
| Query | DCQL (MUST) |
| Verifier client_id | `x509_hash` (MUST) |
| DC API response_mode | `dc_api.jwt` |
| Signing | ES256 min |
| Holder binding | KB-JWT when `cnf` present |
| OID4VCI | 1.0 final |

## 7. Credo-TS capability check (`@credo-ts/openid4vc`)

Confirmed in source (v0.7.x):

| Capability | Status |
|---|---|
| OID4VP version | `v1` (1.0 final), plus `v1.draft21`/`v1.draft24` (draft21 needed for ISO 18013-7 remote mdoc) |
| DC API | `dc_api` and `dc_api.jwt` supported (+ `expectedOrigins`) |
| DCQL | supported (`OpenId4VpVerifiedAuthorizationResponseDcql`) |
| SD-JWT VC | issue + verify (`dc+sd-jwt`, `vc+sd-jwt`) |
| mdoc | issue + verify (`mso_mdoc`) |
| Verifier signer | `OpenId4VcJwtIssuerX5c` with `clientIdPrefix: 'x509_hash'` (HAIP path) — and `OpenId4VcJwtIssuerDid` (not HAIP) |
| OID4VCI issuer | pre-auth + auth-code; SD-JWT VC, mdoc, W3C |

**Gaps vs the FI wallet:** none in Credo itself. The gaps are model-level — `client_id_scheme=did` and DID-based `iss` aren't HAIP-accepted, which is why DID anchoring moves to the registry layer (§4). DC API is Chromium-only (integration constraint, not a Credo gap).

## 8. Decisions this drove

- Engine = Credo `@credo-ts/openid4vc` (capable, confirmed).
- Verifier uses `x509_hash`; issuer uses HTTPS `iss` + matching `did:web`; DID anchoring at the registry layer.
- Demo credential = SD-JWT VC (DID-friendlier than mdoc, whose issuer is IACA/x509). mdoc only for a real-PID phase.
- Target HAIP + OID4VP 1.0 + DCQL + DC API.

## Sources
- HAIP 1.0 draft 05 — https://openid.net/specs/openid4vc-high-assurance-interoperability-profile-1_0-05.html
- OpenID4VP 1.0 — https://openid.net/specs/openid-4-verifiable-presentations-1_0.html
- SD-JWT VC (IETF draft) — https://datatracker.ietf.org/doc/draft-ietf-oauth-sd-jwt-vc/
- FI Unfold DC API verifier — https://playground.france-identite.gouv.fr/doc/marketplace/verifiers/dc-api/
- EU ref OID4VP lib (Kotlin) — https://github.com/eu-digital-identity-wallet/eudi-lib-jvm-openid4vp-kt
- Credo-TS — https://github.com/openwallet-foundation/credo-ts (`packages/openid4vc`)
