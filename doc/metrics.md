# Metrics
## Requirements
* Users can review and edit metrics for dates in the current and previous sprints.
* Users can record, update, or delete a metric for a chain and date. Clearing a metric value deletes it.
* Time metric values use the `HH:MM` format.
* Users can copy sprint totals as a Markdown table.
* Copied totals use this column order: rest, work, pet, workout, activity, and drill.

## User scenarios
### 1. User can view current and previous sprint metric history
1. Sign in with integer chain `Reading` and values `20` on `2026-03-14` and `30` on `2026-03-15`, spanning the previous and current sprints.
2. Open `/metrics` on `2026-03-15`.
3. Verify both sprint tables show `Reading`, the recorded dates, values `20` and `30`, and their totals.

### 2. User can select a date to edit its metrics
1. Sign in with `Reading` value `20` on `2026-03-14`.
2. Open `/metrics`.
3. Click the `2026-03-14` history row.
4. Verify the editable `Reading` field shows date `2026-03-14` and value `20`.

### 3. User can record or update a metric value
1. Sign in with integer chain `Reading` and no value on `2026-03-15`.
2. Open `/metrics` and select `2026-03-15`.
3. Enter `30` in the `Reading` metric field.
4. Wait for saving to finish.
5. Verify the `2026-03-15` history row displays `30`.

### 4. User can delete a metric by clearing its value
1. Sign in with integer chain `Reading` value `30` on `2026-03-15`.
2. Open `/metrics` and select `2026-03-15`.
3. Clear the `Reading` metric field.
4. Wait for saving to finish.
5. Verify the `2026-03-15` history row no longer displays `30`.

### 5. User can view time metrics as hours and minutes
1. Sign in with time chain `Meditation` value `90` on `2026-03-15`.
2. Open `/metrics`.
3. Verify the `Meditation` history value and total display `01:30`.

### 6. User can copy sprint totals as a Markdown table
1. Sign in with chains `🏖️`, `💼`, `🚀`, `🏋️‍♂️`, `🏃`, and `🥼`, with current-sprint totals `1`, `2`, `3`, `4`, `5`, and `6`.
2. Open `/metrics`.
3. Click `total` for the current sprint.
4. Verify the clipboard contains `| rest | work | pet | workout | activity | drill |` followed by `| 1 | 2 | 3 | 4 | 5 | 6 |`.
