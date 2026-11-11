# Boundaries

## Rules
* views/ contains only top level components wired to router
* root component block follows component name, like `.ledger-transactions` for `LedgerTransactions.vue`
* all colors should come from defined palete, like `:root { --color-1: #808080; }`

## Tests
* only feature tests allowed
* tests follow user scenarios
* tests use outcome-based names
* test should start from verb which ends with s
