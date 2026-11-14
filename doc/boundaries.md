# Boundaries

## Style
* Do not use semicolons.
* Do not use ternary operators. Use guard clauses.
* Prefer a functional style.
* Use modern JavaScript: ES2026+ and ES modules.
* `views/` contains only top-level components that connect to the router.
* Predicate names should start with `is`, such as `isCategoriesEmpty`.
* Name the root component's BEM block after the component, such as `.ledger-transactions` for `LedgerTransactions.vue`.
* Use only colors from the defined palette, such as `:root { --color-1: #808080; }`.

## Template
* Use BEM names: block, element, and modifier.
* Use `span` and `div` for BEM elements. Use other elements only when necessary.
* Do not use ARIA, role, or other optional attributes.
* Avoid redundant wrappers.

## Documentation
* Requirements must not include implementation details.

## Tests
* Only feature tests are allowed.
* Each user scenario corresponds to one test.
* Add the user scenario before its test.
* Test names should describe outcomes.
* Test names should match the corresponding user scenario.
