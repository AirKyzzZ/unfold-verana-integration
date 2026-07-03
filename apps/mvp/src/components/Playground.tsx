import { Resolver } from './Resolver.tsx'

export function Playground({ docsUrl }: { docsUrl: string }) {
  return (
    <>
      <section className="hero">
        <div className="wrap">
          <span className="eyebrow" data-rise style={{ animationDelay: '0.05s' }}>
            <span className="live-dot" /> Verifiable Public Registry · live on testnet
          </span>
          <h1 data-rise style={{ animationDelay: '0.12s' }}>
            The signature is valid. <em>Is the issuer governed?</em>
          </h1>
          <p className="lede" data-rise style={{ animationDelay: '0.2s' }}>
            A valid signature proves who signed — not whether they are an authorized{' '}
            <b>Participant</b> in a governed <b>Ecosystem</b>. Verana's <b>Trust Resolver</b>{' '}
            answers that, live and on-chain, returning a <b>Proof-of-Trust</b> from the Verifiable
            Public Registry. Resolve any DID below and watch the registry respond.
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
          <div className="kicker">Two layers of conformance</div>
          <h2 className="sec">Protocol testing proves the credential is well-formed. Verana proves the parties are authorized.</h2>
          <div className="gap-grid">
            <div className="gap-card">
              <h3>Protocol &amp; format conformance</h3>
              <ul>
                <li><span className="m">01</span> Signature verifies against the issuer key</li>
                <li><span className="m">02</span> Format conforms — SD-JWT VC, ISO 18013 mdoc</li>
                <li><span className="m">03</span> Requested attributes are disclosed</li>
                <li><span className="m">✕</span> Says nothing about who is authorized to operate</li>
              </ul>
            </div>
            <div className="gap-card on">
              <h3>Governance conformance · Verana</h3>
              <ul>
                <li><span className="m">✓</span> Resolves the DID as a <b>Verifiable Service</b></li>
                <li><span className="m">✓</span> Confirms an active <b>ISSUER Participant</b> for the Credential Schema</li>
                <li><span className="m">✓</span> Confirms an active <b>VERIFIER Participant</b> before a request is honored</li>
                <li><span className="m">✓</span> Returns a live <b>Proof-of-Trust</b>, bonded on-chain — not a static list</li>
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
          <div className="kicker">How it resolves</div>
          <h2 className="sec">Three queries. One Proof-of-Trust.</h2>
          <div className="steps">
            <div className="step">
              <div className="q">01 · trust resolution</div>
              <h4>Is the DID a Verifiable Service?</h4>
              <p>Dereferences the DID, verifies its Essential Credentials (ECS-Service, ECS-Organization), returns a Proof-of-Trust.</p>
              <code>GET /v1/trust/resolve?did=…</code>
            </div>
            <div className="step">
              <div className="q">02 · issuer authorization</div>
              <h4>Authorized to issue?</h4>
              <p>Checks the DID for an active ISSUER Participant against the Credential Schema's VTJSC.</p>
              <code>…/issuer-authorization?did=…&amp;vtjscId=…</code>
            </div>
            <div className="step">
              <div className="q">03 · verifier authorization</div>
              <h4>Authorized to request?</h4>
              <p>Confirms an active VERIFIER Participant before the relying party may ask for the credential.</p>
              <code>…/verifier-authorization?did=…&amp;vtjscId=…</code>
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
