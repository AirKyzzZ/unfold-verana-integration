# Phase 0 — pipeline & egress MVP (runbook)

**Goal:** prove the France Identité deploy pipeline (GitLab → Kaniko → Harbor → ArgoCD → Istio) end-to-end in the `verana` namespace, and confirm the cluster can reach the Verana testnet resolver — the dependency Phase 1 relies on.

**What's in this repo:**
- `apps/mvp/` — the app (Vite + React, static nginx). Mirrors the playground `hello-world` starter; adds a browser-side trust-check widget that calls `resolver.testnet.verana.network`.
- `deploy/mvp/` — the Helm chart (Deployment + Service + Istio VirtualService), configured for the `verana` namespace at path `/verana/mvp/`.

> The push to GitLab/Harbor/ArgoCD needs your authenticated playground access — follow the steps below. Authoritative platform docs: https://playground.france-identite.gouv.fr/doc/deploy/

## Invariants (must stay aligned)
- `apps/mvp/vite.config.ts` `base` **===** `deploy/mvp/values.yaml` `istio.pathPrefix` **===** `/verana/mvp/`.
- The **GitLab app project name must be `verana-mvp`** — the CI pushes `${HARBOR_HOST}/${HARBOR_PROJECT}/${CI_PROJECT_NAME}`, and `values.yaml` `image.repository` is hardcoded to `…/verana/verana-mvp`.

## Steps

1. **Two GitLab projects** under the `verana` group on `tools.playground.france-identite.gouv.fr`:
   - `verana-mvp` ← contents of `apps/mvp/`
   - `verana-mvp-helm` ← contents of `deploy/mvp/`

2. **App CI variables** (`verana-mvp` → Settings → CI/CD → Variables):
   - `HARBOR_HOST` = `tools.playground.france-identite.gouv.fr`
   - `HARBOR_PROJECT` = `verana`
   - `HARBOR_USERNAME` / `HARBOR_PASSWORD` = your Harbor robot/account credentials (mask them)

3. **Push `apps/mvp/` to `main`.** The pipeline builds with Kaniko and pushes `verana/verana-mvp:<sha>` and `:latest` to Harbor. Confirm the image in the Harbor UI.

4. **Pull secret.** Ensure `harbor-registry-secret` exists in the `verana` namespace (if the platform didn't provision it):
   ```
   kubectl create secret docker-registry harbor-registry-secret \
     --docker-server=tools.playground.france-identite.gouv.fr \
     --docker-username=<user> --docker-password=<token> -n verana
   ```

5. **ArgoCD.** Point an ArgoCD Application at the `verana-mvp-helm` repo, destination namespace `verana` (example below). Confirm against the platform's ArgoCD setup — they may provision the Application for you.
   ```yaml
   apiVersion: argoproj.io/v1alpha1
   kind: Application
   metadata:
     name: verana-mvp
     namespace: argocd
   spec:
     project: verana
     source:
       repoURL: https://tools.playground.france-identite.gouv.fr/gitlab/verana/verana-mvp-helm.git
       targetRevision: main
       path: .
     destination:
       server: https://kubernetes.default.svc
       namespace: verana
     syncPolicy:
       automated: { prune: true, selfHeal: true }
   ```

6. **Sync** → ArgoCD creates the Deployment + Service + VirtualService.

## Exit criteria
- `https://api.playground.france-identite.gouv.fr/verana/mvp/` loads the page.
- Clicking **Check trust** returns a verdict (not "Resolver unreachable") → the cluster's egress to the Verana testnet works.

## What this de-risks for later
- The full gov pipeline and the `verana` path routing (reused verbatim by the Phase 2 verifier).
- Cluster **egress to `resolver.testnet.verana.network`** — if blocked, that's a Phase 1 blocker found cheaply now, and we'd raise it with the France Identité team early.
