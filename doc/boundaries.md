# Boundaries
## Rules
* `views/` contains only top-level components connected to the router
* Predicate names should begin with `is`, such as `isCategoriesEmpty`
* The root component's BEM block should be named after the component, such as `.ledger-transactions` for `LedgerTransactions.vue`
* All colors should come from the defined palette, such as `:root { --color-1: #808080; }`

## Tests
* Only feature tests are allowed
* Tests should follow user scenarios
* Test names should describe outcomes
* Test names should begin with a verb that ends in “s”
