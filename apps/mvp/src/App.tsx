import { useState } from 'react'
import { resolveTrust, type TrustResult } from './lib/resolver.ts'

const EXAMPLE_DID =
  'did:webvh:QmUNEzd1z2TktGLNhQKYuhNp6ckq4xzetHD5oVdH2YD3PA:organization-vs.mosip.testnet.verana.network'

const TONE: Record<string, { label: string; color: string }> = {
  TRUSTED: { label: 'Trusted', color: '#16a34a' },
  PARTIAL: { label: 'Partial', color: '#d97706' },
  UNTRUSTED: { label: 'Untrusted', color: '#dc2626' },
  not_found: { label: 'Not found', color: '#dc2626' },
  error: { label: 'Resolver unreachable', color: '#6b7280' },
}

function Verdict({ result }: { result: TrustResult }) {
  if (result.kind === 'ok') {
    const tone = TONE[result.status]
    return (
      <div className="verdict" style={{ borderColor: tone.color }}>
        <span className="chip" style={{ background: tone.color }}>
          {tone.label}
        </span>
        <span className="meta">
          {result.production ? 'production' : 'testnet'} · evaluated {result.evaluatedAt}
        </span>
      </div>
    )
  }
  const tone = TONE[result.kind]
  return (
    <div className="verdict" style={{ borderColor: tone.color }}>
      <span className="chip" style={{ background: tone.color }}>
        {tone.label}
      </span>
      {result.kind === 'error' && <span className="meta">{result.message}</span>}
    </div>
  )
}

export function App() {
  const [did, setDid] = useState(EXAMPLE_DID)
  const [result, setResult] = useState<TrustResult | null>(null)
  const [loading, setLoading] = useState(false)

  async function check() {
    if (!did.trim()) return
    setLoading(true)
    setResult(null)
    setResult(await resolveTrust(did.trim()))
    setLoading(false)
  }

  return (
    <main>
      <header>
        <h1>Verana × EUDIW Unfold</h1>
        <p className="sub">Phase 0 — deploy pipeline &amp; resolver egress smoke test</p>
      </header>

      <section className="card">
        <label htmlFor="did">Resolve a DID against the Verana trust network</label>
        <div className="row">
          <input
            id="did"
            value={did}
            onChange={(e) => setDid(e.target.value)}
            spellCheck={false}
            placeholder="did:webvh:…"
          />
          <button onClick={check} disabled={loading}>
            {loading ? 'Checking…' : 'Check trust'}
          </button>
        </div>
        {result && <Verdict result={result} />}
        <p className="hint">
          Calls <code>resolver.testnet.verana.network</code>. If this returns a verdict, the
          France Identité cluster can reach the Verana testnet — the dependency Phase 1 needs.
        </p>
      </section>
    </main>
  )
}
