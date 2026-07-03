import { useEffect, useState } from 'react'
import { resolve, VERDICT_META, type Resolution } from '../lib/trust.ts'

const PRESETS: { label: string; did: string; tone: string }[] = [
  {
    label: 'MOSIP ecosystem anchor',
    tone: 'var(--verify)',
    did: 'did:webvh:QmUNEzd1z2TktGLNhQKYuhNp6ckq4xzetHD5oVdH2YD3PA:organization-vs.mosip.testnet.verana.network',
  },
  {
    label: 'Inji verifier',
    tone: 'var(--partial)',
    did: 'did:web:inji-verify.mosip.testnet.verana.network:v1:verify',
  },
  {
    label: 'Counter-example',
    tone: 'var(--untrust)',
    did: 'did:web:not-a-member.example.com',
  },
]

export function Resolver() {
  const [did, setDid] = useState(PRESETS[0].did)
  const [res, setRes] = useState<Resolution | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    void run(PRESETS[0].did)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function run(value?: string) {
    const target = (value ?? did).trim()
    if (!target) return
    setDid(target)
    setLoading(true)
    setRes(null)
    setRes(await resolve(target))
    setLoading(false)
  }

  return (
    <div className="instrument" id="resolve">
      <div className="instrument-head">
        <span>Trust Resolver — TRQP / Q1</span>
        <span className="dots">
          <i /><i /><i />
        </span>
      </div>
      <div className="instrument-body">
        <div className="field-label">Decentralized identifier</div>
        <div className="field-row">
          <input
            value={did}
            spellCheck={false}
            onChange={(e) => setDid(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && run()}
            placeholder="did:webvh:…"
          />
          <button className="btn solid" onClick={() => run()} disabled={loading}>
            {loading ? 'Resolving…' : 'Resolve ↵'}
          </button>
        </div>
        <div className="presets">
          {PRESETS.map((p) => (
            <button key={p.label} className="chip" onClick={() => run(p.did)}>
              <span className="swatch" style={{ background: p.tone }} />
              {p.label}
            </button>
          ))}
        </div>

        {!res ? (
          <div className="readout empty">{loading ? 'querying the trust network…' : 'awaiting a did'}</div>
        ) : (
          <Verdict res={res} />
        )}
      </div>
    </div>
  )
}

function Verdict({ res }: { res: Resolution }) {
  const meta = VERDICT_META[res.verdict]
  const t = `t-${meta.tone}`
  return (
    <div className="readout">
      <div className="verdict">
        <div className={`stamp ${t}`}>
          <span className="ring" />
          <span className="glyph">{meta.glyph}</span>
        </div>
        <div className="verdict-meta">
          <div className={`status ${t}`}>{meta.label}</div>
          <div className="did">{res.did}</div>
          <div className="facts">
            {res.production !== undefined && (
              <span className="badge-net">{res.production ? 'production' : 'testnet'}</span>
            )}
            {res.evaluatedAtBlock !== undefined && (
              <span className="fact">
                <span>block</span>
                <b>#{res.evaluatedAtBlock}</b>
              </span>
            )}
            {res.evaluatedAt && (
              <span className="fact">
                <span>evaluated</span>
                <b>{new Date(res.evaluatedAt).toISOString().replace('T', ' ').slice(0, 19)}Z</b>
              </span>
            )}
            {res.message && (
              <span className="fact">
                <span>note</span>
                <b>{res.message}</b>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
