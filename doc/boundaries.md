# Boundaries

## Style
* don't use semicolons
* don't use ternary operators, use guard clauses
* prefer a functional style
* write modern js: ES2026+, es modules
* `views/` contains only top-level components connected to the router
* Predicate names should begin with `is`, such as `isCategoriesEmpty`
* The root component's BEM block should be named after the component, such as `.ledger-transactions` for `LedgerTransactions.vue`
* All colors should come from the defined palette, such as `:root { --color-1: #808080; }`

## Template
* use bem namespace: block, element, modifier
* use span + div as main BEM tags, use others only when span and div will not work, don't use ids
* aria-, role and other non mandatory attributes forbidden
* avoid redundant wrappers

## Documentations
* Requirements should not have implementation details.

## Tests
* Only feature tests are allowed
* Tests should follow user scenarios, one user scenario correspond to one test, when adding test it's user scenario should be added first
* Test names should describe outcomes
* Test names should follow the name of corresponding user scenario
