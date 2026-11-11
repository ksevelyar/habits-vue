# Charts
## Requirements
* Users can choose which chains appear as charts on the dashboard.
* Users can select a reporting period of one month, one quarter, or one year.
* Users can navigate backward and forward between reporting periods.
* Charts respect each chain's aggregation setting. For example, a body-weight chain shows the average body weight for the period, while a pomodoro chain shows the total number of pomodoros completed during the period.

## User scenarios
### 1. User can view charts for enabled chains
1. Sign in as `person@example.com` with enabled chart chain `Reading` and disabled chart chain `Running`.
2. Return March values `20` on March 5 and `25` on March 7 for `Reading`.
3. Open `/` on March 15, 2026.
4. Verify a `Reading` chart with its two points is displayed.
5. Verify no `Running` chart is displayed.

### 2. User can select a one-month chart period
1. Sign in as `person@example.com` with `Reading`, with `Show in charts` enabled.
2. Open `/` on March 15, 2026.
3. Verify `1 month` is selected.
4. Verify the range is `2026-03-01 – 2026-03-31`.

### 3. User can select a quarterly chart period
1. Sign in as `person@example.com` with `Reading`, with `Show in charts` enabled.
2. Open `/` on June 15, 2026.
3. Click `quartal`.
4. Verify `quartal` is selected and the range is `2026-04-01 – 2026-06-30`.

### 4. User can select a one-year chart period
1. Sign in as `person@example.com` with `Reading`, with `Show in charts` enabled.
2. Open `/` on June 15, 2026.
3. Click `1 year`.
4. Verify `1 year` is selected and the range is `2026-01-01 – 2026-12-31`.

### 5. User can navigate to earlier chart periods
1. Sign in as `person@example.com` with `Reading`, with `Show in charts` enabled.
2. Open `/` on March 15, 2026.
3. Click `←`.
4. Verify the range is `2026-02-01 – 2026-02-28` and `→` is displayed.

### 6. User can return to the current chart period
1. Sign in as `person@example.com` with `Reading`, with `Show in charts` enabled.
2. Open `/` on March 15, 2026 and click `←`.
3. Click `→`.
4. Verify the range is `2026-03-01 – 2026-03-31`.
5. Verify `→` is hidden.

### 7. User can view a period aggregate and its change from the preceding period
1. Sign in as `person@example.com` with `Reading`, with `Show in charts` enabled and `sum` aggregation.
2. Return values `10` and `20` for March 2026 and `5` and `10` for February 2026.
3. Open `/` on March 15, 2026.
4. Verify the `Reading` chart displays aggregate `30` and change `+15`.

### 8. User sees an empty state when no chains are enabled for charts
1. Sign in with `Reading` and `Running`, both with `Show in charts` cleared.
2. Open `/`.
3. Verify `No chains are enabled for charts.` is displayed.
