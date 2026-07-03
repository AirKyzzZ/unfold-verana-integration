import { Resolver } from './components/Resolver.tsx'

const DOCS_URL = 'https://docs.verana.io'

export function App() {
  return (
    <>
      <header className="site-head">
        <div className="wrap">
          <a className="brand" href="#top">
            <span className="seal">✦</span> Verana
          </a>
          <span className="head-tag">
            EUDIW Unfold · <b>Conformance</b>
          </span>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="wrap">
            <span className="eyebrow" data-rise style={{ animationDelay: '0.05s' }}>
              <span className="live-dot" /> Trust registry · live on testnet
            </span>
            <h1 data-rise style={{ animationDelay: '0.12s' }}>
              Every wallet checks the signature. <em>None checks the trust.</em>
            </h1>
            <p className="lede" data-rise style={{ animationDelay: '0.2s' }}>
              Verana resolves, in real time and on-chain, whether a credential's issuer is
              accredited and a verifier authorized — the eIDAS&nbsp;2 trust step every EUDI wallet
              needs and the playground skips. Paste any DID below and watch the network answer.
            </p>
            <div className="hero-cta" data-rise style={{ animationDelay: '0.28s' }}>
              <a className="btn solid" href="#resolve">
                Resolve a DID ↓
              </a>
              <a className="btn" href={DOCS_URL} target="_blank" rel="noreferrer">
                Read the docs ↗
              </a>
            </div>
            <div data-rise style={{ animationDelay: '0.36s' }}>
              <Resolver />
            </div>
          </div>
        </section>

        <section>
          <div className="wrap">
            <div className="kicker">The gap Verana fills</div>
            <h2 className="sec">A valid signature is not the same as a trusted issuer.</h2>
            <div className="gap-grid">
              <div className="gap-card">
                <h3>Every verifier in the marketplace</h3>
                <ul>
                  <li><span className="m">01</span> Checks the credential's cryptographic signature</li>
                  <li><span className="m">02</span> Validates the format &amp; expiry</li>
                  <li><span className="m">✕</span> Never asks: is this issuer accredited?</li>
                  <li><span className="m">✕</span> Never asks: am I an authorized verifier?</li>
                </ul>
              </div>
              <div className="gap-card on">
                <h3>A verifier backed by Verana</h3>
                <ul>
                  <li><span className="m">✓</span> Resolves the issuer's DID against the registry</li>
                  <li><span className="m">✓</span> Confirms accreditation for this credential type</li>
                  <li><span className="m">✓</span> Proves its own authorization to request it</li>
                  <li><span className="m">✓</span> Returns a live proof-of-trust, not a static list</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="wrap">
            <div className="kicker">The trust triangle</div>
            <h2 className="sec">An issuer, a verifier, and Verana vouching for both.</h2>
            <div className="triangle">
              <div className="node">
                <div className="role">Issuer</div>
                <div className="name">Accredited attestation provider</div>
                <div className="status-line">
                  <span className="live-dot" /> registered · issuer permission
                </div>
              </div>
              <div className="flow">
                credential<span className="arrow">→</span>presentation
              </div>
              <div className="node">
                <div className="role">Verifier</div>
                <div className="name">Relying party</div>
                <div className="status-line">
                  <span className="live-dot" /> registered · verifier permission
                </div>
              </div>
              <div className="node registry" style={{ gridColumn: '1 / -1', marginTop: '8px' }}>
                <div className="role">Verana · trust registry</div>
                <div className="name">resolves both, on-chain, before trust is granted</div>
                <div className="status-line">
                  <span className="live-dot" /> TRQP · verifiable public registry
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="wrap">
            <div className="kicker">How it resolves</div>
            <h2 className="sec">Three queries. One proof of trust.</h2>
            <div className="steps">
              <div className="step">
                <div className="q">Q1 · resolve</div>
                <h4>Is the DID trusted?</h4>
                <p>Dereferences the DID, verifies its essential credentials, returns TRUSTED / PARTIAL / UNTRUSTED.</p>
                <code>GET /v1/trust/resolve?did=…</code>
              </div>
              <div className="step">
                <div className="q">Q2 · issuer</div>
                <h4>Accredited to issue?</h4>
                <p>Checks the issuer's on-chain permission for this credential schema.</p>
                <code>…/issuer-authorization?did=…&amp;vtjscId=…</code>
              </div>
              <div className="step">
                <div className="q">Q3 · verifier</div>
                <h4>Authorized to ask?</h4>
                <p>Confirms the relying party may request this credential — verify the verifier.</p>
                <code>…/verifier-authorization?did=…&amp;vtjscId=…</code>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-foot">
        <div className="wrap foot-grid">
          <div className="foot-note">
            <b>Verana</b> — verifiable public registry &amp; trust resolver<br />
            network <b>vna-testnet-1</b> · resolver.testnet.verana.network<br />
            EUDIW Unfold playground · listed under Conformance
          </div>
          <a className="btn" href={DOCS_URL} target="_blank" rel="noreferrer">
            Documentation ↗
          </a>
        </div>
      </footer>
    </>
  )
}
