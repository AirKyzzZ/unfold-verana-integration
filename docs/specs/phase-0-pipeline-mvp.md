# Phase 0, pipeline & egress MVP (runbook)

**Goal:** prove the France Identité deploy pipeline (GitLab → Kaniko → Harbor → ArgoCD → Istio) end-to-end in the `verana` namespace, and confirm the cluster can reach the Verana testnet resolver, the dependency Phase 1 relies on.

**What's in this repo:**
- `apps/mvp/`, the app (Vite + React, static nginx). Mirrors the playground `hello-world` starter; adds a browser-side trust-check widget that calls `resolver.testnet.verana.network`.
- `deploy/mvp/`, the Helm chart (Deployment + Service + Istio VirtualService), configured for the `verana` namespace at path `/verana/mvp/`.

> The push to GitLab/Harbor/ArgoCD needs your authenticated playground access, follow the steps below. Authoritative platform docs: https://playground.france-identite.gouv.fr/doc/deploy/

> Naming/paths below are verified against the deploy docs: [01-build-and-image-publish](https://playground.france-identite.gouv.fr/deploy/01-build-and-image-publish/), [02-gitlab-cicd-pipeline](https://playground.france-identite.gouv.fr/deploy/02-gitlab-cicd-pipeline/), [03-helm-chart-deployment](https://playground.france-identite.gouv.fr/deploy/03-helm-chart-deployment/), [04-virtualservice-routing](https://playground.france-identite.gouv.fr/deploy/04-virtualservice-routing/), [05-argocd-application](https://playground.france-identite.gouv.fr/deploy/05-argocd-application/). Entity namespace = `verana`; GitLab group = `plg/partners/verana`.

## Invariants (must stay aligned)
- `apps/mvp/vite.config.ts` `base` **===** `deploy/mvp/values.yaml` `istio.pathPrefix` **===** `/verana/mvp/`.
- The **GitLab app project must be named `mvp`**, CI pushes `${HARBOR_HOST}/${HARBOR_PROJECT}/${CI_PROJECT_NAME}`, so `CI_PROJECT_NAME=mvp` → image `…/verana/mvp`, which `values.yaml` `image.repository` points at.

## Steps

1. **Two GitLab projects** under group `plg/partners/verana` on `tools.playground.france-identite.gouv.fr/gitlab`:
   - `mvp` ← contents of `apps/mvp/`
   - `helm-mvp` ← contents of `deploy/mvp/`  (convention: helm repo = `helm-{slug}`)

2. **App CI variables** (`mvp` → Settings → CI/CD → Variables), some may already be set at group level:
   - `HARBOR_HOST` = `tools.playground.france-identite.gouv.fr`
   - `HARBOR_PROJECT` = `verana`
   - `HARBOR_USERNAME` / `HARBOR_PASSWORD` = your Harbor robot credentials (masked)

3. **Push `apps/mvp/` to `main`.** The pipeline (Kaniko, `only: main`) pushes `verana/mvp:<sha>` and refreshes the mutable `verana/mvp:latest`. Confirm the image in Harbor.

4. **Pull secret.** Ensure `harbor-registry-secret` exists in the `verana` namespace (if not platform-provisioned):
   ```
   kubectl create secret docker-registry harbor-registry-secret \
     --docker-server=tools.playground.france-identite.gouv.fr \
     --docker-username=<user> --docker-password=<token> -n verana
   ```

5. **ArgoCD Application** (you create it; repo credentials and the `verana` ArgoCD project are platform-provisioned):
   ```yaml
   apiVersion: argoproj.io/v1alpha1
   kind: Application
   metadata:
     name: mvp
     namespace: argocd
   spec:
     project: verana
     source:
       repoURL: https://tools.playground.france-identite.gouv.fr/gitlab/plg/partners/verana/helm-mvp.git
       targetRevision: HEAD
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
- Cluster **egress to `resolver.testnet.verana.network`**, if blocked, that's a Phase 1 blocker found cheaply now, and we'd raise it with the France Identité team early.
