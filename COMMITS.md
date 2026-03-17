# Conventional Commits Guide

## Format

```sh
<type>(<scope>): <description>

[optional body]

[optional footer]
```

## Types

| Type | Description | When to use |
|------|-------------|-------------|
| `feat` | New feature | Adding new functionality |
| `fix` | Bug fix | Correcting broken behavior |
| `docs` | Documentation only | README, comments, JSDoc |
| `style` | Code style | Formatting, missing semicolons, no logic change |
| `refactor` | Code refactor | Restructuring without changing behavior |
| `test` | Tests | Adding or fixing tests |
| `chore` | Build/tooling | Build process, dependencies, CI |
| `perf` | Performance | Improving performance |
| `ci` | CI/CD | CI pipeline changes |
| `build` | Build system | Build configuration changes |
| `revert` | Revert commit | Reverting a previous commit |

## Scope (optional)

Kebab-case, describes the area of code affected:

- `auth`, `store`, `routing`, `i18n`, `ui`, `api`, `config`

## Rules

- **Description**: max 50 characters, imperative mood, no period at end
- **Body**: wrap at 72 characters, explain the *why* not the *what*
- **Footer**: reference issues `Closes #42`, breaking changes `BREAKING CHANGE: ...`

## Examples

### Correct

```sh
feat(auth): add token refresh on 401
fix(store): resolve race condition in load trigger
docs(readme): add development setup instructions
refactor(routing): extract route constants to core/const
test(auth): add unit tests for auth interceptor
chore(deps): update Angular to 21.2.0
```

### Incorrect

```sh
wip stuff                          ← no type, too vague
feat: Added new login feature.     ← past tense, has period
fix: fix                           ← too vague
FEAT: auth                         ← uppercase type
```

## Breaking Changes

```sh
feat(api)!: remove deprecated /v1 endpoint

BREAKING CHANGE: The /v1 endpoint has been removed.
Migrate to /v2 before upgrading.
```

## Referencing Issues

```sh
fix(auth): handle 401 responses correctly

Closes #42
```

## Validation

Run locally before committing:

```bash
npm run commit:validate "feat(auth): add token refresh"   # ✅ passes
npm run commit:validate "wip stuff"                        # ❌ fails
```
