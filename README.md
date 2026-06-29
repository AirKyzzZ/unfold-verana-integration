# Unfold × Verana integration

Integrating [Verana](https://verana.io) — a decentralized trust registry (Verifiable Public Registry + TRQP resolver) — into France Identité's [EUDIW Unfold Playground](https://playground.france-identite.gouv.fr), the shared EU sandbox for EU Digital Identity Wallet interoperability testing.

**Goal:** an issuer, a verifier, and Verana as the trust registry vouching for both — surfaced as a marketplace card under *Online Verifiers* with a live, EUDI-interoperable trust check. The differentiator: a **live trust-registry verdict inside the OID4VP flow** ("is this issuer accredited? is this verifier authorized?"), which no EUDI pilot verifier does today.

This is the EUDI successor to the shipped [MOSIP × Verana](https://playground.mosip.testnet.verana.network/) integration.

## Status

Design phase (deep-spec, pre-build). No production code yet.

## Docs

| Doc | What |
|---|---|
| [`docs/specs/unfold-verana-integration.md`](docs/specs/unfold-verana-integration.md) | The integration spec — architecture, the two-stack/resolver-bridge constraint, and the multi-step (Phase 0→3) plan |
| [`docs/research/eudi-oid4vc-interop-profile.md`](docs/research/eudi-oid4vc-interop-profile.md) | Technical: HAIP / OID4VP 1.0 / DCQL / DC-API / SD-JWT VC, the DID↔x509 binding, Credo-TS capabilities |
| [`docs/research/trust-registry-eudi-landscape.md`](docs/research/trust-registry-eudi-landscape.md) | Strategic: how EUDI does trust (ETSI lists + OpenID Federation), competitors, and Verana's positioning |

## Approach in one line

EUDI is X.509 / ETSI-trusted-list / OpenID-Federation centric; Verana is DID / on-chain-registry centric. The **resolver/TRQP is the bridge** (format-agnostic), and the build is **EUDI-native** (Credo-TS OID4VCI issuer + OID4VP verifier) with **DID anchoring at the trust-registry layer** — scoped to the non-qualified EAA space, complementary to ETSI/OIF.

## Build phases

- **Phase 0** — validate the gov deploy pipeline (GitLab → Kaniko → Harbor → ArgoCD → Istio) in the `verana` namespace.
- **Phase 1** — Verana foundation: on-chain ecosystem + identities on testnet, resolver + trust panel, basic DIDComm triangle (reusable foundation).
- **Phase 2** — EUDI OpenID integration with Credo: OID4VCI issuer + OID4VP verifier interoperating with the real EUDI wallets (the marketplace card).
- **Phase 3** — marketplace listing + developer docs.
