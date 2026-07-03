import { Resolver } from './Resolver.tsx'

const VERANA_APP = 'https://app.testnet.verana.network'
const VISUALIZER = 'https://vis.testnet.verana.network'
const EXPLORER = 'https://explorer.testnet.verana.network/Verana%20Testnet'

const CAPS: { tag: string; title: string; body: string; lead?: boolean }[] = [
  {
    tag: 'This demo',
    title: 'Verify the verifier',
    body: 'Resolve whether a relying party is an active VERIFIER Participant for the credential it requests — the eIDAS 2 RP-authorization check the wallet needs.',
    lead: true,
  },
  {
    tag: 'Issuance',
    title: 'Verify the issuer',
    body: 'Confirm a credential’s issuer is an accredited ISSUER Participant for its Credential Schema — accreditation a signature alone can’t prove.',
  },
  {
    tag: 'Governance',
    title: 'Ecosystem governance',
    body: 'On-chain Trust Registries with versioned governance frameworks, bonded Participants and full lifecycle — not a static, hand-maintained list.',
  },
  {
    tag: 'Cross-border',
    title: 'Recognition across ecosystems',
    body: 'TRQP recognition resolves whether one authority recognizes another’s ecosystem — the cross-border trust EUDI needs between member states.',
  },
  {
    tag: 'Attestations',
    title: 'Trust for non-qualified EAAs',
    body: 'Governance for the attestations outside the ETSI qualified stack — professional, organizational, sectoral credentials — where no trusted list applies.',
  },
  {
    tag: 'Complementary',
    title: 'Above lists & federation',
    body: 'A live authorization layer that complements ETSI trusted lists and OpenID Federation: they enumerate and discover, Verana answers “authorized, right now?”',
  },
]

export function Playground({ docsUrl }: { docsUrl: string }) {
  return (
    <>
      <section className="hero">
        <div className="wrap">
          <span className="eyebrow" data-rise style={{ animationDelay: '0.05s' }}>
            <span className="live-dot" /> Verifiable Public Registry · live on testnet
          </span>
          <h1 data-rise style={{ animationDelay: '0.12s' }}>
            Before you present, <em>is the verifier even allowed to ask?</em>
          </h1>
          <p className="lede" data-rise style={{ animationDelay: '0.2s' }}>
            eIDAS 2 requires every relying party to be registered and authorized for exactly the data
            it requests. Verana resolves that live: is this DID an active <b>VERIFIER Participant</b>{' '}
            for the credential it’s asking for? A <b>Proof-of-Trust</b> from the Verifiable Public
            Registry — the check the wallet needs before it discloses anything. Resolve a DID below.
          </p>
          <div className="hero-cta" data-rise style={{ animationDelay: '0.28s' }}>
            <a className="btn solid" href="#resolve">Resolve a DID ↓</a>
            <a className="btn" href="#/docs">How it works ↗</a>
          </div>
          <div data-rise style={{ animationDelay: '0.36s' }}>
            <Resolver />
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="kicker">The unchecked party</div>
          <h2 className="sec">The wallet checks the credential. Today, nobody checks the requester.</h2>
          <div className="gap-grid">
            <div className="gap-card">
              <h3>What happens in the playground now</h3>
              <ul>
                <li><span className="m">01</span> A relying party requests a PID or attribute</li>
                <li><span className="m">02</span> The wallet verifies the signature &amp; format</li>
                <li><span className="m">✕</span> Nothing confirms the requester is <b>registered</b></li>
                <li><span className="m">✕</span> Nothing confirms it may ask for <b>that data</b></li>
              </ul>
            </div>
            <div className="gap-card on">
              <h3>What Verana resolves first</h3>
              <ul>
                <li><span className="m">✓</span> The requester’s DID is a <b>Verifiable Service</b></li>
                <li><span className="m">✓</span> It holds an active <b>VERIFIER Participant</b> for the schema</li>
                <li><span className="m">✓</span> Its authorization is <b>bonded on-chain</b>, not self-asserted</li>
                <li><span className="m">✓</span> The answer is a live <b>Proof-of-Trust</b>, resolved on demand</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="kicker">The trust chain</div>
          <h2 className="sec">An issuer, a verifier — both bonded Participants in the VPR.</h2>
          <div className="triangle">
            <div className="node">
              <div className="role">Issuer · Verifiable Service</div>
              <div className="name">Attestation provider</div>
              <div className="status-line"><span className="live-dot" /> active ISSUER Participant</div>
            </div>
            <div className="flow">credential<span className="arrow">→</span>presentation</div>
            <div className="node">
              <div className="role">Verifier · Verifiable Service</div>
              <div className="name">Relying party</div>
              <div className="status-line"><span className="live-dot" /> active VERIFIER Participant</div>
            </div>
            <div className="node registry" style={{ gridColumn: '1 / -1', marginTop: '8px' }}>
              <div className="role">Verana · Verifiable Public Registry</div>
              <div className="name">the Trust Resolver returns a Proof-of-Trust for both, before the exchange is trusted</div>
              <div className="status-line"><span className="live-dot" /> TRQP v2.0 · verana-trqp/spec-v4</div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="kicker">Beyond this demo</div>
          <h2 className="sec">What Verana brings to the EU identity ecosystem.</h2>
          <div className="caps">
            {CAPS.map((c) => (
              <div className={`cap${c.lead ? ' lead' : ''}`} key={c.title}>
                <span className="tag">{c.tag}</span>
                <h4>{c.title}</h4>
                <p>{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="kicker">Explore the live registry</div>
          <h2 className="sec">Every Proof-of-Trust is backed by public, on-chain data.</h2>
          <div className="vlinks">
            <a className="vlink" href={`${VERANA_APP}/discover`} target="_blank" rel="noreferrer">
              <span className="dot" /> Browse ecosystems ↗
            </a>
            <a className="vlink" href={`${VISUALIZER}/trust-registries`} target="_blank" rel="noreferrer">
              <span className="dot" /> Trust registries ↗
            </a>
            <a className="vlink" href={`${VISUALIZER}/network-graph`} target="_blank" rel="noreferrer">
              <span className="dot" /> Network graph ↗
            </a>
            <a className="vlink" href={`${VISUALIZER}/did-directory`} target="_blank" rel="noreferrer">
              <span className="dot" /> DID directory ↗
            </a>
            <a className="vlink" href={EXPLORER} target="_blank" rel="noreferrer">
              <span className="dot" /> Chain explorer ↗
            </a>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="kicker">How it resolves</div>
          <h2 className="sec">Three queries. One Proof-of-Trust.</h2>
          <div className="steps">
            <div className="step">
              <div className="q">01 · trust resolution</div>
              <h4>Is the DID a Verifiable Service?</h4>
              <p>Dereferences the DID, verifies its Essential Credentials (ECS-Service, ECS-Organization), returns a Proof-of-Trust.</p>
              <span className="code">GET /v1/trust/resolve?did=…</span>
            </div>
            <div className="step">
              <div className="q">02 · verifier authorization</div>
              <h4>Authorized to request?</h4>
              <p>Checks the DID for an active <b>VERIFIER Participant</b> against the Credential Schema’s VTJSC.</p>
              <span className="code">…/verifier-authorization?did=…&amp;vtjscId=…</span>
            </div>
            <div className="step">
              <div className="q">03 · issuer authorization</div>
              <h4>Authorized to issue?</h4>
              <p>The mirror check for the credential’s issuer — an active <b>ISSUER Participant</b> for the schema.</p>
              <span className="code">…/issuer-authorization?did=…&amp;vtjscId=…</span>
            </div>
          </div>
          <div className="hero-cta" style={{ marginTop: '28px' }}>
            <a className="btn" href="#/docs">Read the integration docs →</a>
            <a className="btn" href={docsUrl} target="_blank" rel="noreferrer">Verana spec (v4) ↗</a>
          </div>
        </div>
      </section>
    </>
  )
}
