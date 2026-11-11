# Ledger transactions
## Requirements
* `/ledger` lists transactions for the selected month, quarter, or year and displays the returned cumulative balance.
* Period anchors, transaction input, and timestamp display use the user's profile timezone. Requests send occurrence timestamps in UTC.
* Amount input is in whole rubles. Positive values are income, negative values are expenses, and requests send nonzero integer kopecks.
* Transactions can be created, edited, and deleted. Successful mutations refresh the selected period.
* API validation and request errors are shown to the user.

## User scenarios
### 1. User records income or an expense
1. Sign in with timezone `Europe/Moscow` and categories `Work` with ID `7` and `Home` with ID `8`.
2. Open `/ledger` on March 15, 2026.
3. Enter `2026-03-09T15:30` as the occurrence time, `-1500` as the amount, and select `Work`.
4. Click `Create`.
5. Verify the request sends `category_id: 7`, `amount_kopecks: -150000`, and `occurred_at: 2026-03-09T12:30:00.000Z`.
6. Verify `−1 500 ₽` is displayed.

### 2. User edits or deletes a transaction
1. Sign in with timezone `Europe/Moscow`, categories `Home` and `Work`, and transaction `42`: `-9 ₽` in `Home` at `2026-03-09T12:00:00Z`.
2. Open `/ledger`.
3. Click `Edit` for the `Home` transaction.
4. Change the occurrence time to `2026-03-09T17:45`, amount to `1200`, and category to `Work`.
5. Click `Update`.
6. Verify refreshed history displays `Work` and `1 200 ₽`.
7. Click `Delete` for transaction `42`.
8. Verify refreshed history displays `No transactions in this period.`

### 3. User views and navigates transaction periods
1. Sign in with timezone `Europe/Moscow`.
2. Open `/ledger` at `2026-03-31T22:30:00Z`, when the local date is April 1.
3. Verify the initial request uses period `month` with anchor date `2026-04-01`.
4. Click `Previous`, then verify the March range is displayed and `Next` is visible.
5. Click `Next`, then click `Quarter` and `Year`.
6. Verify requests use anchors `2026-04-01` for the quarter and `2026-01-01` for the year.

### 4. User sees transaction errors
1. Sign in with category `Work` and open `/ledger`.
2. Enter occurrence time `2026-03-09T12:00` and amount `0`.
3. Click `Create`.
4. Verify `Amount cannot be zero.` is displayed and no transaction request is sent.
5. Enter `-1500.25` and click `Create`.
6. Verify `Enter an amount in whole rubles.` is displayed and no transaction request is sent.
7. Enter `100` and click `Create`.
8. Return `validation failed` with `timestamp must end in Z`.
9. Verify both errors are displayed and the amount field still contains `100`.
