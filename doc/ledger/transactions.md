# Ledger transactions
## Requirements
* `/ledger` lists transactions for the selected month, quarter, or year and displays the returned cumulative balance.
* Period anchors, transaction input, and timestamp display use the user's profile timezone. Requests send occurrence timestamps in UTC.
* Amount input is in whole rubles. Positive values are income, negative values are expenses, and requests send nonzero integer kopecks.
* Transactions can be created, edited, and deleted. Successful mutations refresh the selected period.
* API validation and request errors are shown to the user.
## User scenarios
### 1. User records income or an expense
* The transaction form selects a category, signed ruble amount, and occurrence time.
* The request contains the amount in kopecks and occurrence time in UTC.
### 2. User edits or deletes a transaction
* The user can change a transaction's category, amount, and occurrence time or delete it.
* The selected period refreshes after a successful change.
### 3. User views and navigates transaction periods
* The user can select month, quarter, or year and navigate to previous or next periods.
* History shows period boundaries, transactions, and the cumulative balance returned by the backend.
### 4. User sees transaction errors
* Invalid amounts and backend validation or request errors are displayed without losing the form.
