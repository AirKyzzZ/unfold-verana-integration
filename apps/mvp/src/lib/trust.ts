const RESOLVER =
  import.meta.env.VITE_RESOLVER_URL ?? 'https://resolver.testnet.verana.network/v1/trust'

export type TrustStatus = 'TRUSTED' | 'PARTIAL' | 'UNTRUSTED'
export type Verdict = 'trusted' | 'partial' | 'untrusted' | 'not_found' | 'unreachable'

export interface Resolution {
  verdict: Verdict
  did: string
  production?: boolean
  evaluatedAt?: string
  evaluatedAtBlock?: number
  message?: string
}

// Q1 — resolve trust status of a DID. Fail-closed: a 404 is a definitive
// "no trust record" (untrusted), any other failure is an outage and must
// never read as trusted.
export async function resolve(did: string): Promise<Resolution> {
  const url = `${RESOLVER}/resolve?did=${encodeURIComponent(did)}&detail=summary`
  try {
    const res = await fetch(url, { headers: { accept: 'application/json' } })
    if (res.status === 404) return { verdict: 'not_found', did }
    if (!res.ok) return { verdict: 'unreachable', did, message: `resolver returned ${res.status}` }
    const d = await res.json()
    const map: Record<TrustStatus, Verdict> = {
      TRUSTED: 'trusted',
      PARTIAL: 'partial',
      UNTRUSTED: 'untrusted',
    }
    return {
      verdict: map[d.trustStatus as TrustStatus] ?? 'untrusted',
      did: d.did ?? did,
      production: d.production,
      evaluatedAt: d.evaluatedAt,
      evaluatedAtBlock: d.evaluatedAtBlock,
    }
  } catch (e) {
    return { verdict: 'unreachable', did, message: e instanceof Error ? e.message : 'network error' }
  }
}

// Q2 / Q3 — is this DID an accredited issuer / authorized verifier for a schema?
export async function checkAuthorization(
  role: 'issuer' | 'verifier',
  did: string,
  vtjscId: string,
): Promise<boolean | null> {
  const path = role === 'issuer' ? 'issuer-authorization' : 'verifier-authorization'
  const url = `${RESOLVER}/${path}?did=${encodeURIComponent(did)}&vtjscId=${encodeURIComponent(vtjscId)}`
  try {
    const res = await fetch(url, { headers: { accept: 'application/json' } })
    if (res.status === 404) return false
    if (!res.ok) return null
    const d = await res.json()
    return !!d.authorized
  } catch {
    return null
  }
}

export const VERDICT_META: Record<
  Verdict,
  { label: string; glyph: string; tone: string }
> = {
  trusted: { label: 'Trusted', glyph: '✓', tone: 'ok' },
  partial: { label: 'Partial', glyph: '≈', tone: 'warn' },
  untrusted: { label: 'Untrusted', glyph: '✕', tone: 'bad' },
  not_found: { label: 'Not on registry', glyph: '∅', tone: 'bad' },
  unreachable: { label: 'Resolver unreachable', glyph: '⋯', tone: 'dim' },
}
