# Charts

## Requirements
* Users can choose which chains appear as charts on the dashboard.
* Users can select a reporting period of one month, one quarter, or one year.
* Users can navigate backward and forward between reporting periods.
* Charts respect each chain's aggregation setting. For example, a body-weight chain shows the average body weight for the period, while a pomodoro chain shows the total number of pomodoros completed during the period.

## User scenarios

### 1. User can view charts for enabled chains
* The dashboard shows a chart for each chain returned by the chart request.

### 2. User can select a one-month chart period
* Selecting 1 month shows the current calendar month by default.

### 3. User can select a quarterly chart period
* Selecting 1 quarter shows the current calendar quarter by default.

### 4. User can select a one-year chart period
* Selecting 1 year shows the current calendar year by default.

### 5. User can navigate to earlier chart periods
* Selecting Previous shows the preceding range for the selected period.

### 6. User can return to the current chart period
* Selecting Next after moving back moves toward the current period.
* Next is hidden when the current period is selected.

### 7. User can view a period aggregate and its change from the preceding period
* A chart shows its total or average when the selected range contains values.
* It shows the change when both the selected and preceding ranges contain values.

### 8. User sees an empty state when no chains are enabled for charts
* The dashboard shows a message when chart loading finishes and no chains are returned.
