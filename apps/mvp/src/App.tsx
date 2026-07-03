import { useEffect, useState } from 'react'
import { Playground } from './components/Playground.tsx'
import { Docs } from './components/Docs.tsx'

const DOCS_URL = 'https://docs.verana.io'

function useRoute() {
  const [hash, setHash] = useState(window.location.hash)
  useEffect(() => {
    const on = () => setHash(window.location.hash)
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return hash.replace(/^#\/?/, '')
}

export function App() {
  const route = useRoute()
  const onDocs = route === 'docs'
  useEffect(() => window.scrollTo(0, 0), [route])

  return (
    <>
      <header className="site-head">
        <div className="wrap">
          <a className="brand" href="#/">
            <span className="seal">✦</span> Verana
          </a>
          <nav className="head-nav">
            <a href="#/" className={!onDocs ? 'on' : ''}>Playground</a>
            <a href="#/docs" className={onDocs ? 'on' : ''}>Docs</a>
            <span className="head-tag">EUDIW Unfold · <b>Conformance</b></span>
          </nav>
        </div>
      </header>

      <main id="top">{onDocs ? <Docs docsUrl={DOCS_URL} /> : <Playground docsUrl={DOCS_URL} />}</main>

      <footer className="site-foot">
        <div className="wrap foot-grid">
          <div className="foot-note">
            <b>Verana</b> — Verifiable Public Registry (VPR) &amp; Trust Resolver<br />
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
