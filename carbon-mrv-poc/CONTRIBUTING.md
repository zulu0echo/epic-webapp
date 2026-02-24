# Contributing to Carbon MRV PoC

Thank you for your interest in contributing. This is a proof-of-concept repository; we welcome issues and pull requests that improve clarity, fix bugs, or align the implementation with the [specification](spec/README.md).

## How to contribute

1. **Open an issue** for bugs, spec ambiguities, or feature ideas (e.g. onchain anchoring, EIP-712 attestations).
2. **Fork the repo** and create a branch for your change.
3. **Make your changes**; keep the test suite passing (`npm test`).
4. **Open a pull request** with a short description and reference to any related issue.

## Development setup

```bash
npm install
npm run build
npm test
npm run demo
```

## Code style

- TypeScript strict mode; follow existing patterns in `src/`.
- New behavior should have tests in `src/*.test.ts`.

## Scope

- **In scope**: Bug fixes, spec alignment, documentation, tests, and small extensions (e.g. EIP-712 signing, optional onchain anchor).
- **Out of scope for this repo**: Full production registries, compliance logic, or official accreditation; those belong in separate projects.

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT).
