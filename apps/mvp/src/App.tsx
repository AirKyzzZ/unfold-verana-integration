import { Playground } from './components/Playground.tsx'
import { VeranaMark } from './components/VeranaMark.tsx'

const DOCS_URL = 'https://docs.verana.io'
const COUNCIL_URL = 'https://veranacouncil.org/about'

export function App() {
  return (
    <>
      <header className="site-head">
        <div className="wrap">
          <a className="brand" href="#top">
            <VeranaMark size={30} /> Verana
          </a>
          <nav className="head-nav">
            <a href={DOCS_URL} target="_blank" rel="noreferrer">Docs ↗</a>
            <a href={COUNCIL_URL} target="_blank" rel="noreferrer">Council ↗</a>
            <span className="head-tag">EUDIW Unfold · <b>Conformance</b></span>
          </nav>
        </div>
      </header>

      <main id="top">
        <Playground docsUrl={DOCS_URL} councilUrl={COUNCIL_URL} />
      </main>

      <footer className="site-foot">
        <div className="wrap foot-grid">
          <div className="foot-note">
            <b>Verana</b>, Verifiable Public Registry (VPR) &amp; Trust Resolver<br />
            TRQP v2.0 · profile <b>verana-trqp/spec-v4</b> · did:webvh<br />
            network <b>vna-testnet-1</b> · resolver.testnet.verana.network<br />
            EUDIW Unfold playground · Conformance
          </div>
          <a className="btn" href={DOCS_URL} target="_blank" rel="noreferrer">
            docs.verana.io ↗
          </a>
        </div>
      </footer>
    </>
  )
}
