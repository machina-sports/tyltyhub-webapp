# Deployment Guide

## Tagging Strategy

### Staging
Create tags with format: `v.staging-{id}.{minor}`

Where:
- `{id}` = ClickUp task ID or package version
- `{minor}` = Sequential number starting from 1

Examples:
- `v.staging-86a985k6e.1`
- `v.staging-2.1.0`

### Production
Create tags with format: `v.release-{id}.{minor}`

Examples:
- `v.release-86a985k6e.1`
- `v.release-2.1.0`

## Deployment Process

1. **Create and push tag:**
   ```bash
   git tag v.staging-86a985k6e.1
   git push origin v.staging-86a985k6e.1
   ```

2. **Deploy using GitHub Actions:**
   - Go to **Release Staging** or **Release Production** workflow
   - Click "Run workflow"
   - Enter the image tag (e.g., `v.staging-86a985k6e.1`)
   - Click "Run workflow"

## Notes
- No semantic versioning is used
- Increment minor version sequentially for iterations (`.1`, `.2`, `.3`, etc.)
