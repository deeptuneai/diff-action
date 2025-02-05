# diff-action

### Local development

Install [act](https://github.com/nektos/act) to run Github workflows locally:


## Example usage in your GitHub Repository


In `.github/workflows/mygithubaction.yaml`:

```yaml
name: Run Deeptest Github Action

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: deeptuneai/diff-action@main
        with:
          # pass your preview frontend deployment url from a prior CI/CD step
          deployment-url: https://my-preview-deployment.example.com
```
