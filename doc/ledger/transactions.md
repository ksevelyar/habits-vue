# Ledger transactions
## Requirements
* `/ledger` lists transactions for the selected month, quarter, or year and displays the date range and period statistics.
* Transactions are grouped by day, can be expanded, and today is expanded by default.
* Period anchors, transaction input, and timestamp display use the user's profile timezone. Requests send occurrence timestamps in UTC.
* Amount input is in whole rubles. Positive values are income, negative values are expenses, and requests send nonzero integer kopecks.
* Transactions can be created, edited, and deleted. Successful mutations refresh the selected period.
* API validation and request errors are shown to the user.

## User scenarios
### 1. User records income or an expense
1. Sign in with timezone `Europe/Moscow` and categories `Work` with ID `7` and `Home` with ID `8`.
2. Open `/ledger` at 15:00 on March 15, 2026.
3. Enter 15:30 on March 9, 2026 as the occurrence time, `-1500` as the amount, and select `Work`.
4. Wait one minute, then click `Create`.
5. Verify the request sends `category_id: 7`, `amount_kopecks: -150000`, and `occurred_at: 2026-03-09T12:30:00.000Z`.
6. Verify `−1 500` is displayed.
7. Verify the amount is cleared and the occurrence time defaults to 15:01 on March 15, 2026.

### 2. User views period statistics
1. Sign in with categories `Home` and `Work`.
2. Return `-100` in `Home`, `-50` and `200` in `Work`, and a balance of `500`.
3. Open `/ledger`.
4. Verify the date range appears before the statistics.
5. Verify expense labels display `Home −100` and `Work −50`.
6. Verify Balance, Spent, and Income display `500`, `−150`, and `200` without kopecks.

### 3. User views transactions grouped by day
1. Sign in with transactions on March 15 and March 14, 2026.
2. Open `/ledger` on March 15, 2026.
3. Verify both dates show their spent and income totals.
4. Verify March 15 is expanded and its transactions are visible.
5. Verify March 14 is collapsed and its transactions are hidden.
6. Expand March 14.
7. Verify its transactions are visible.
8. Verify Edit and Delete are link styled.

### 4. User edits a transaction
1. Sign in with timezone `Europe/Moscow`, categories `Home` and `Work`, and transaction `42`: `-9` in `Home` at 15:00 on March 9, 2026.
2. Open `/ledger` and expand March 9.
3. Click `Edit` for the `Home` transaction.
4. Change the occurrence time to 17:45 on March 9, 2026, amount to `1200`, and category to `Work`.
5. Click `Update`.
6. Verify refreshed history displays `Work` and `1 200`.

### 5. User deletes a transaction
1. Sign in with timezone `Europe/Moscow`, category `Home`, and transaction `42`: `-9` in `Home` at 15:00 on March 9, 2026.
2. Open `/ledger` and expand March 9.
3. Click `Delete` for transaction `42`.
4. Verify refreshed history displays `No transactions in this range.`

### 6. User views and navigates transaction periods
1. Sign in with timezone `Europe/Moscow`.
2. Open `/ledger` at 01:30 on April 1, 2026.
3. Verify the initial request uses period `month` with anchor date `2026-04-01`.
4. Click `Previous`, then verify the March range is displayed and `Next` is visible.
5. Click `Next`, then click `Quarter` and `Year`.
6. Verify requests use anchors `2026-04-01` for the quarter and `2026-01-01` for the year.

### 7. User sees transaction errors
1. Sign in with category `Work` and open `/ledger`.
2. Enter occurrence time 12:00 on March 9, 2026, and amount `0`.
3. Click `Create`.
4. Verify `Amount cannot be zero.` is displayed and no transaction request is sent.
5. Enter `-1500.25` and click `Create`.
6. Verify `Enter an amount in whole rubles.` is displayed and no transaction request is sent.
7. Enter `100` and click `Create`.
8. Return `validation failed` with `timestamp must end in Z`.
9. Verify both errors are displayed and the amount field still contains `100`.
