const RESOLVER_URL =
  import.meta.env.VITE_RESOLVER_URL ?? 'https://resolver.testnet.verana.network/v1/trust'

export type TrustStatus = 'TRUSTED' | 'PARTIAL' | 'UNTRUSTED'

type ResolveResponse = {
  did: string
  trustStatus: TrustStatus
  production: boolean
  evaluatedAt: string
  evaluatedAtBlock: number
  expiresAt: string
}

export type TrustResult =
  | { kind: 'ok'; status: TrustStatus; production: boolean; evaluatedAt: string }
  | { kind: 'not_found' }
  | { kind: 'error'; message: string }

// Fail-closed: a 404 is a definitive "no trust record", any other failure is an
// outage and must never read as trusted. Mirrors the MOSIP playground trust engine.
export async function resolveTrust(did: string): Promise<TrustResult> {
  const url = `${RESOLVER_URL}/resolve?did=${encodeURIComponent(did)}&detail=summary`
  try {
    const res = await fetch(url, { headers: { accept: 'application/json' } })
    if (res.status === 404) return { kind: 'not_found' }
    if (!res.ok) return { kind: 'error', message: `resolver returned ${res.status}` }
    const data = (await res.json()) as ResolveResponse
    return {
      kind: 'ok',
      status: data.trustStatus,
      production: data.production,
      evaluatedAt: data.evaluatedAt,
    }
  } catch (e) {
    return { kind: 'error', message: e instanceof Error ? e.message : 'network error' }
  }
}
