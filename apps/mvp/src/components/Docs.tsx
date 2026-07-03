const SPEC: [string, string][] = [
  ['Category', 'Conformance — governance layer'],
  ['Protocol', 'Trust Registry Query Protocol (TRQP) v2.0'],
  ['Profile', 'verana-trqp/spec-v4'],
  ['Registry', 'Verifiable Public Registry (VPR) · network vna-testnet-1'],
  ['DID methods', 'did:webvh (primary), did:web'],
  ['Trust objects', 'Verifiable Service · Participant (ISSUER / VERIFIER) · Credential Schema · VTJSC'],
  ['Essential Credentials', 'ECS-Service, ECS-Organization, ECS-Persona'],
  ['Standards', 'eIDAS 2.0 ARF · ToIP TRQP · W3C VC Data Model 2.0'],
  ['Endpoint', 'resolver.testnet.verana.network/v1/trust'],
]

const USECASES: { n: string; title: string; body: string }[] = [
  {
    n: '01',
    title: 'Resolve an issuer',
    body: 'Input an issuer DID and confirm it resolves as a Verifiable Service holding an active ISSUER Participant for a given Credential Schema — the accreditation a signature check cannot show.',
  },
  {
    n: '02',
    title: 'Check a verifier before you present',
    body: 'Input a relying-party DID and confirm an active VERIFIER Participant for the credential type it requests — the eIDAS 2 “verify the verifier” step, resolved on-chain.',
  },
  {
    n: '03',
    title: 'Trace a Proof-of-Trust',
    body: 'Follow the full chain: DID → Verifiable Service → ECS credentials → Participant authorization → Ecosystem governance root — the governance trust chain no protocol-testing tool shows.',
  },
]

export function Docs({ docsUrl }: { docsUrl: string }) {
  return (
    <section className="hero docs">
      <div className="wrap">
        <span className="eyebrow"><span className="live-dot" /> Conformance · governance layer</span>
        <h1 className="docs-h1">Trust resolution for governed ecosystems</h1>
        <p className="lede">
          Format-conformance tools answer <em>“is this credential well-formed?”</em> Verana answers
          the question above it: <b>is the party authorized to operate?</b> The Verana Trust Resolver
          resolves whether an issuer or verifier is a bonded <b>Participant</b> in a governed{' '}
          <b>Ecosystem</b> of the Verifiable Public Registry, and returns a live <b>Proof-of-Trust</b> —
          the governance-layer conformance the eIDAS 2 ARF requires and protocol testing does not cover.
        </p>

        <div className="doc-block">
          <div className="kicker">Technical specifications</div>
          <div className="spec-table">
            {SPEC.map(([k, v]) => (
              <div className="spec-row" key={k}>
                <span className="k">{k}</span>
                <span className="v">{v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="doc-block">
          <div className="kicker">What the resolver answers</div>
          <div className="steps">
            <div className="step">
              <div className="q">01 · trust resolution</div>
              <h4>Verifiable Service?</h4>
              <p>Resolves the DID, verifies its ECS credentials, returns a Proof-of-Trust (<code>trusted</code>, evaluated block &amp; time).</p>
              <code>GET /v1/trust/resolve?did=…</code>
            </div>
            <div className="step">
              <div className="q">02 · issuer authorization</div>
              <h4>Active ISSUER Participant?</h4>
              <p>TRQP authorize, action <b>issue</b>, resource <code>vpr:verana:vna-testnet-1:cs:&lt;id&gt;</code>.</p>
              <code>…/issuer-authorization?did=…&amp;vtjscId=…</code>
            </div>
            <div className="step">
              <div className="q">03 · verifier authorization</div>
              <h4>Active VERIFIER Participant?</h4>
              <p>TRQP authorize, action <b>verify</b> — the relying party's right to request this credential.</p>
              <code>…/verifier-authorization?did=…&amp;vtjscId=…</code>
            </div>
          </div>
        </div>

        <div className="doc-block">
          <div className="kicker">Use cases</div>
          <div className="usecases">
            {USECASES.map((u) => (
              <div className="usecase" key={u.n}>
                <span className="uc-n">{u.n}</span>
                <div>
                  <h4>{u.title}</h4>
                  <p>{u.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="doc-block">
          <div className="kicker">Integrate</div>
          <p className="lede" style={{ maxWidth: '60ch', fontSize: '1rem' }}>
            Any verifier in the playground can add a governance check with one call. No SDK, no account —
            the resolver is CORS-open and fail-closed.
          </p>
          <pre className="codeblock">{`# Is this issuer a bonded, authorized Participant?
curl "https://resolver.testnet.verana.network/v1/trust/\\
resolve?did=<issuer-did>&detail=summary"

# → Proof-of-Trust: { trusted, evaluatedAtBlock, evaluatedAt }`}</pre>
        </div>

        <div className="doc-block contact">
          <div>
            <div className="kicker" style={{ marginBottom: '10px' }}>Contact</div>
            <p className="foot-note">
              Verana Foundation · <b>docs.verana.io</b><br />
              Ecosystem onboarding &amp; governance frameworks on request.
            </p>
          </div>
          <div className="hero-cta">
            <a className="btn solid" href="#/">Open the playground →</a>
            <a className="btn" href={docsUrl} target="_blank" rel="noreferrer">docs.verana.io ↗</a>
          </div>
        </div>
      </div>
    </section>
  )
}
