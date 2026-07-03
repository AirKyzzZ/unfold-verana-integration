# Verana trust playground

<!--
  Docs-page content for the France Identité EUDIW Unfold marketplace, Conformance category.
  Authored in the sparse, technical marketplace style (cf. /marketplace/verifiers/stelau/).
  This is the "Docs" button target, hand to France Identité to host at
  /marketplace/conformance/verana/. The "Test" button points to the live app.
-->

## Overview

Verana adds a governance-conformance layer to the EUDIW ecosystem: before a credential exchange begins, it resolves whether the issuing or verifying party is an authorized Participant in a governed Ecosystem, a check that protocol and format conformance testing does not cover.

The playground exposes a live Trust Resolver over the Verana Verifiable Public Registry (VPR), returning a Proof-of-Trust for any DID via the Trust Registry Query Protocol (TRQP v2.0, profile `verana-trqp/spec-v4`) on network `vna-testnet-1`.

## Available conformance capabilities

### 1. Verifier authorization (verify the verifier) using TRQP v2.0

Resolves whether a relying party is authorized to request a given credential type before any presentation is made, the eIDAS 2 relying-party authorization step the wallet needs.

- Resolves the relying party's DID as a Verifiable Service
- Confirms an active VERIFIER Participant for the Credential Schema
- Returns a live, bonded, on-chain Proof-of-Trust
- `did:webvh` resolution against network `vna-testnet-1`

### 2. Issuer accreditation (verify the issuer) using TRQP v2.0

Confirms a credential's issuer is accredited to issue its type within a governed Ecosystem, accreditation a signature check alone cannot show.

- Confirms an active ISSUER Participant for the Credential Schema
- Verifies Essential Credentials (ECS-Service, ECS-Organization)
- Returns issuer accreditation status, on demand

### 3. Trust resolution and Proof-of-Trust

Resolves any DID to a Proof-of-Trust, the governance trust chain from DID → Verifiable Service → Participant authorization → Ecosystem governance root.

- Format-agnostic: complements SD-JWT VC and ISO 18013 mdoc flows
- Complements ETSI trusted lists and OpenID Federation rather than replacing them
- Public, CORS-open resolver; fail-closed

**Open Verifier** → `https://api.playground.france-identite.gouv.fr/verana/verana/`

**Docs** → https://docs.verana.io · **Governance** → https://veranacouncil.org
