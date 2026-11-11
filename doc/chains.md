# Chains
## Requirements
* A chain represents a habit that a user tracks over time with metrics.
* Users can create, update, and order chains.
* A chain has an active state, chart visibility, type, name, aggregation setting, description, and sort order.
* Supported chain types are integer, float, boolean, and time.
* Supported aggregation settings are sum and average.
* Chains are listed by sort order, from lowest to highest.

## User scenarios
### 1. User can view chains
1. Sign in as `person@example.com` with `Reading` at order `1` and `Running` at order `2`.
2. Open `/chains`.
3. Verify `Reading` appears before `Running`.

### 2. User can create a chain
1. Sign in as `person@example.com`.
2. Open `/chains/new`.
3. Enter `Reading` as the name and `Read pages each day` as the description.
4. Select `integer` and `sum`, leave `Active` checked, and check `Show in charts`.
5. Click `Add`.
6. Verify `/chains/42/edit` opens and shows the saved `Reading` values.

### 3. User can update a chain
1. Sign in with chain `42`, named `Reading`, with description `Read pages each day`.
2. Open `/chains/42/edit`.
3. Verify `Reading` and `Read pages each day` are displayed.
4. Change the description to `Read 30 pages each day`.
5. Click `Save`.
6. Verify `/chains` opens and lists `Reading`.

### 4. User can order chains by dragging them
1. Sign in with `Reading` at order `1` and `Running` at order `2`.
2. Open `/chains`.
3. Drag `Running` onto `Reading`.
4. Verify `Running` appears before `Reading`.
5. Reload `/chains`.
6. Verify `Running` still appears before `Reading`.

### 5. User can activate or deactivate a chain
1. Sign in with active chain `42`, named `Reading`.
2. Open `/chains/42/edit`.
3. Clear `Active`.
4. Click `Save`.
5. Reopen `/chains/42/edit`.
6. Verify `Active` is cleared.

### 6. User can show or hide a chain in dashboard charts
1. Sign in with active chain `42`, named `Reading`, with `Show in charts` cleared.
2. Open `/chains/42/edit`.
3. Check `Show in charts`.
4. Click `Save`.
5. Open `/`.
6. Verify the `Reading` chart is displayed.
