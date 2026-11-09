# Metrics

## Requirements
* Users can review and edit metrics for dates in the current and previous sprints.
* Users can record, update, or delete a metric for a chain and date. Clearing a metric value deletes it.
* Time metric values use the `HH:MM` format.
* Users can copy sprint totals as a Markdown table.
* Copied totals use this column order: rest, work, pet, workout, activity, and drill.

## User scenarios

### 1. User can view current and previous sprint metric history
* The page shows sprint history, chain names, daily values, and totals.

### 2. User can select a date to edit its metrics
* Selecting a history row loads that date's metrics into the editable fields.

### 3. User can record or update a metric value
* Entering a non-empty value saves it after the debounce delay.

### 4. User can delete a metric by clearing its value
* Clearing a value deletes the metric after the debounce delay.

### 5. User can view time metrics as hours and minutes
* Time totals and history values use the `HH:MM` format.

### 6. User can copy sprint totals as a Markdown table
* Selecting a sprint total copies its values as a Markdown table in the fixed category order.
