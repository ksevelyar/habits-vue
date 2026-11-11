# Ledger categories
## Requirements
* `/ledger/categories` lists, creates, renames, and deletes the authenticated user's categories.
* Category names are non-empty and unique per user.
* A category with transactions cannot be deleted.

## User scenarios
### 1. User lists categories
* The user can view their categories.

### 2. User creates a category
* The user can create a category with a unique name.

### 3. User renames a category
* The user can change a category name.

### 4. User deletes an unused category
* The user can delete a category with no transactions.

### 5. User cannot create a category with a duplicate name
* A duplicate category name is rejected.

### 6. User cannot delete a category in use
* A category with transactions remains listed when deletion is rejected.
