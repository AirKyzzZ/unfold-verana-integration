# Unfold Demo Ecosystem, Governance Framework (EGF)

Version 1.0

This is the Ecosystem Governance Framework for the **Unfold demonstration ecosystem**, a Verana Trust Registry operated on the testnet `vna-testnet-1` for the France Identité EUDIW Unfold playground. It exists to demonstrate governance-layer trust resolution (verify the verifier, verify the issuer) and is not for production or regulated use.

## Scope

Demonstration only. Synthetic identities. The ecosystem governs one non-qualified attestation Credential Schema and the authorization of Participants against it.

## Roles

- **Ecosystem authority** — `unfold-org` (Verana), controls the Trust Registry and its Credential Schema.
- **Issuers** — entities holding an active ISSUER Participant for the Credential Schema.
- **Verifiers** — relying parties holding an active VERIFIER Participant for the Credential Schema.

## Rules

1. To issue the ecosystem's credential, an entity must be a Verifiable Service with an active ISSUER Participant for the Credential Schema.
2. To request the ecosystem's credential, a relying party must be a Verifiable Service with an active VERIFIER Participant for the Credential Schema.
3. Trust is resolved by any party via the Verana Trust Resolver over the Trust Registry Query Protocol (TRQP v2.0, profile `verana-trqp/spec-v4`).

Governance of the Verana network itself is provided by the Verana Council (https://veranacouncil.org).
