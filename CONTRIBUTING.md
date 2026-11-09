# Contributing to chinese_regions

Thank you for your interest in contributing to `chinese_regions`!

## How to Report Issues

If you find a bug or have a feature suggestion, please first search the existing [Issues](https://github.com/kamaslau/chinese_regions/issues) to avoid duplicates.

When creating a new issue, please include:

- **Bug reports**: Steps to reproduce, the HTTP status code you used, the expected output, and the actual output.
- **Feature requests**: A clear description of the feature you would like to add and its use case (e.g., supporting a new language or custom text).

## How to Submit Code

1. **Fork** this repository.
2. Create your feature branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**.
4. **Commit your changes**:

   ```bash
   git commit -m "feat: add function xxx"
   ```

5. **Push** to your branch:

   ```bash
   git push origin feature/your-feature-name
   ```

6. Open a **Pull Request** against this repository.

## Development Environment

This project is built on Node.js. **Please use [pnpm](https://pnpm.io/) as the package manager for this project. Do not use `npm` or `yarn`** — this ensures consistent dependency resolution and lockfile behavior across all contributors.

### Prerequisites

- Node.js (LTS version recommended)
- pnpm (install via `npm install -g pnpm` or follow the [official guide](https://pnpm.io/installation))

### Setup

```bash
# Install dependencies (pnpm only)
pnpm install

# Run linting (if available)
pnpm lint

# Run tests (if available)
pnpm test

```

> **Important**: If you accidentally run `npm install` or `yarn`, please delete the generated `package-lock.json` / `yarn.lock` and re-run `pnpm install` before committing. Only `pnpm-lock.yaml` should be tracked in version control.

## Commit Message Convention

We recommend using the [Conventional Commits](https://www.conventionalcommits.org/) format, for example:

- `feat: add new feature`
- `fix: correct text for a status code`
- `docs: update documentation`

## License

By contributing code, you agree that your contributions will be licensed under the project's [MIT License](https://github.com/kamaslau/chinese_regions/blob/main/LICENSE).
