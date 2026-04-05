#!/usr/bin/env bash
# ── @roboticela/devkit — npm publish script ──────────────────────────────────
set -e

RELEASE_TYPE=${1:-patch}   # patch | minor | major

echo ""
echo "  @roboticela/devkit — Publishing"
echo "  Release type: $RELEASE_TYPE"
echo ""

# Ensure we're logged in to npm
if ! npm whoami &>/dev/null; then
  echo "  ✗ Not logged in to npm. Run: npm login"
  exit 1
fi

# Run lint and build
echo "  → Linting..."
npm run lint

echo "  → Building..."
npm run build

# Bump version
echo "  → Bumping version ($RELEASE_TYPE)..."
npm version $RELEASE_TYPE --no-git-tag-version

VERSION=$(node -p "require('./package.json').version")
echo "  → New version: $VERSION"

# Publish
echo "  → Publishing to npm..."
npm publish --access public

# Git tag
git add package.json
git commit -m "release: v$VERSION"
git tag "v$VERSION"

echo ""
echo "  ✓ Published @roboticela/devkit@$VERSION"
echo "  ✓ Tagged: v$VERSION"
echo ""
echo "  Run 'git push && git push --tags' to push to GitHub."
echo ""
