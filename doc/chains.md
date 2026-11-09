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
* The chain list shows chains by sort order.

### 2. User can create a chain
* The user enters the chain details and submits the form.
* After creation, the chain's edit page opens.

### 3. User can update a chain
* The edit form loads the selected chain and lets the user change its fields.
* Saving returns the user to the chain list.

### 4. User can order chains by dragging them
* Dragging one chain onto another swaps their sort order and saves the new order.

### 5. User can activate or deactivate a chain
* The user changes a chain's active state in the create or edit form and saves it.

### 6. User can show or hide a chain in dashboard charts
* The user changes whether a chain appears in dashboard charts in the create or edit form and saves it.
