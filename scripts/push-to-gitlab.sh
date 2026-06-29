#!/usr/bin/env bash
# Push the Phase 0 MVP to the France Identité GitLab as two projects:
#   apps/mvp   -> plg/partners/verana/mvp        (app, builds the image)
#   deploy/mvp -> plg/partners/verana/helm-mvp   (Helm chart, ArgoCD watches)
#
# Run this in your own shell (e.g. via the `!` prefix) so your GitLab auth is
# used locally and no token is shared. Create the two empty projects in the
# GitLab UI first, or rely on push-to-create if your instance enables it.
set -euo pipefail

GL_BASE="${GL_BASE:-https://tools.playground.france-identite.gouv.fr/gitlab/plg/partners/verana}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

push_dir() { # <src-subdir> <gitlab-project>
  local src="$1" proj="$2" dst="$TMP/$2"
  cp -R "$ROOT/$src" "$dst"
  (
    cd "$dst"
    git init -q -b main
    git add -A
    git commit -q -m "init: $proj (verana × unfold, phase 0)"
    git remote add origin "$GL_BASE/$proj.git"
    git push -u origin main
  )
  echo "pushed $src -> $GL_BASE/$proj.git"
}

push_dir "apps/mvp" "mvp"
push_dir "deploy/mvp" "helm-mvp"
