# Trust Registry × EUDI, competitive & standards landscape

**Date:** 2026-06-29
**Purpose:** Where a DID / on-chain trust registry (Verana) fits in the EUDI ecosystem, who else is in the space, and how to position. Shareable with Fabrice / Ariel.
**Headline:** EUDI's native trust is **ETSI X.509 trusted lists + (emerging) OpenID Federation**. Verana has **no hook in the qualified stack**; its lane is **non-qualified EAAs as a complementary governance layer**, and its first-mover wedge is a **live trust-registry verdict surfaced inside the OID4VP flow, which no EUDI pilot does today**.

---

## 1. How EUDI does trust natively

- **ETSI TS 119 612 trusted lists.** Each member state publishes a signed national Trusted List (wallet providers, PID providers, QEAA/PuB-EAA providers, cert providers, registered RPs). The Commission publishes a List-of-Trusted-Lists (LoTL). Wallets pre-configure the LoTL as a single anchor. 24+ ETSI specs rolling out through 2027.
- **RP registration.** A registered relying party gets a **Relying Party Access Certificate (RPAC)**, X.509, used by the wallet to authenticate the RP in OID4VP, and (now optional per CIR 2025/848) a **Registration Certificate (RPRC)** stating which attributes it may request.
- **Verify-the-issuer.** HAIP mandates the issuer's signing cert in the SD-JWT VC `x5c` header, traceable to a trusted-list anchor. DIDs are not in scope for this.
- **OpenID Federation** is emerging as the **scalable discovery/registration layer on top of** ETSI lists (Italy: 13 IdPs / 10k+ RPs; NL, Sweden piloting; OIDF presented at the EUDI Launchpad Dec 2025; the 2026 ARF round may normalize it for RP/issuer discovery). It does discovery, not authorization.

## 2. Players

| Player | Trust mechanism | On-chain? | EUDI/OID4VP | Note |
|---|---|---|---|---|
| **cheqd** (closest competitor) | TRAIN = **DNS-anchored** accreditation chains (Fraunhofer); cheqd chain only for DID-linked resources. Rebranded "trust registry → trust graph" | partial | targets EUDI **non-qualified EAAs**; profiles as OpenID Federation | loudest positioning, **appears pre-deployment** |
| **EBSI TIR** | On-chain (Ethereum) Trusted Issuers Registry, hierarchical Root TAO→TAO→Issuer | **yes** | supports OID4VP within EBSI | **permissioned, EC-governed, EBSI-domain only, not TRQP** |
| **OpenID Federation** | JWT entity-statement trust chains | no | becoming EUDI discovery layer | **complementary** (discovery, not authorization) |
| **walt.id** | ETSI trusted lists + ISO VICAL tooling | no | full OID4VP/OID4VCI, HAIP | infra provider, not a registry operator |
| **Procivis** | ETSI TS 119 602 trusted lists, RPAC/RPRC | no | active, SPRIND MoU | compliance/state-aligned |
| **Gataca** | OpenID Federation | no | WE BUILD pilot |, |
| **swiyu (CH)** | did:webvh + SD-JWT VC + government Base Registry of trust statements | no | OID4VCI/OID4VP | not ETSI/OIF/chain, shows even well-governed ecosystems diverge |
| Dock/Truvera, Hedera Guardian, IDunion/SPRIND | various | some | weak/none in EUDI | not material here |
| **ToIP TRQP** | the *protocol* Verana's resolver speaks (v2.0, public review, ISO-bound) | n/a | transport/framework-neutral, no native EUDI binding yet | standards momentum, not yet widely implemented |

## 3. The unfilled gap (Verana's wedge)

**No EUDI pilot verifier, including any in the France Identité Unfold playground (25+ verifiers), performs a live trust-registry query that surfaces an accreditation verdict during the OID4VP flow.** Trust is checked silently (x5c chain) or via pre-loaded ETSI lists. The EWC RFC 012 "check issuer is on the EWC Trust List" is a centralized ETSI XML list, not a live external/registry query. **A verifier that calls TRQP and shows a live "issuer accredited / verifier authorized" verdict would be first.**

## 4. Verana strategic read

**Genuinely novel:** permissionless on-chain VPR + TRQP resolver + a live OID4VP verdict is **not matched by any profiled player** (EBSI = permissioned/non-TRQP; cheqd = DNS-anchored/pre-deployment; OIF = discovery only).

**Aligned with the current:** TRQP v2.0 (ISO-bound), OID4VP 1.0 (final), the non-qualified EAA space (outside ETSI's mandatory X.509), and the genuine "live verdict at presentation time" gap.

**Where it swims against the current (name these in any pitch):**
1. **Qualified stack is X.509-only.** PID/QEAA/mDL have no DID/TRQP hook. Stay out of that lane.
2. **"Permissionless/external registry" is an eIDAS governance red flag**, national registrars are the source of truth; a permissionless registry confers no legal standing. → position as **complementary**, scoped to non-regulated EAAs, attesting *additional governance* over entities, not their fundamental legal trust.
3. **OpenID Federation normalization (2026 ARF round)** could shrink the need for an out-of-band TRQP call in EU-perimeter cases.
4. **DIDComm + W3C-VC (Verana-native) are not in EUDI**, only the resolver/TRQP + DID-anchoring (with x509 bridging) translate.

**Differentiation:** vs **cheqd**, ship a live TRQP verdict in OID4VP before they deploy; vs **EBSI**, permissionless + TRQP + cross-ecosystem vs permissioned/EBSI-only; vs **OpenID Federation**, TRQP answers *authorization* ("authorized to issue THIS schema under THIS framework?"), a layer **above** OIF's discovery → complementary, not competing.

**Opportunities (ordered):** (1) non-qualified EAA governance layer; (2) own "live trust verdict at presentation time"; (3) cross-ecosystem TRQP bridge (EUDI ↔ non-EU/Hyperledger/EBSI); (4) the "governance above key-binding" gap HAIP explicitly leaves out of scope; (5) non-EU regulated markets where X.509-only issuer identity isn't mandated.

## 5. Positioning conclusion

Pitch Verana on Unfold as: **"the first live trust-registry verdict inside an EUDI OID4VP flow, for the non-qualified EAA space, complementary to ETSI trusted lists and OpenID Federation."** Do **not** pitch into PID/QEAA or as a replacement for regulated trust.

## Sources
- cheqd, https://cheqd.io/blog/the-trust-registry-opportunity-in-the-eudi-market/ · https://cheqd.io/blog/why-cheqd-is-changing-from-trust-registry-to-trust-graph/ · TRAIN https://train.trust-scheme.de/info/
- EBSI TIR, https://hub.ebsi.eu/apis/pilot/trusted-issuers-registry/v4 · https://hub.ebsi.eu/vc-framework/trust-model/issuer-trust-model-v3
- ToIP TRQP v2.0, https://trustoverip.github.io/tswg-trust-registry-protocol/approved/
- OpenID Federation, https://openid.net/specs/openid-federation-1_0.html · https://openid.net/oidf-presents-at-ecs-eudi-wallets-launchpad-2025-event/
- ETSI EUDI trust rollout, https://www.biometricupdate.com/202606/etsi-defines-eudi-wallet-ecosystems-trust-infrastructure-with-standards-rollout
- EUDI RP registration, https://eudi.dev/latest/discussion-topics/x-relying-party-registration/
- EWC RFC 012, https://github.com/EWC-consortium/eudi-wallet-rfcs/blob/main/ewc-rfc012-trust-mechanism.md
- walt.id, https://docs.walt.id/concepts/trust-systems/eu-trust-lists · Procivis, https://www.procivis.ch/insights/eudi-trust-lists-what-they-are-and-how-they-work
- swiyu, https://swiyu-admin-ch.github.io/technology-stack/
