# Ledger categories
## Requirements
* `/ledger/categories` lists, creates, renames, and deletes the authenticated user's categories.
* Category names are non-empty and unique per user.
* A category with transactions cannot be deleted.

## User scenarios
### 1. User lists categories
1. Sign in as `person@example.com` with categories `Home` and `Work`.
2. Open `/ledger/categories`.
3. Verify `Home` and `Work` are displayed.

### 2. User creates a category
1. Sign in as `person@example.com`.
2. Open `/ledger/categories`.
3. Enter `Work` in the category name field.
4. Click `Create`.
5. Verify `Work` is displayed.

### 3. User renames a category
1. Sign in with category `Work`.
2. Open `/ledger/categories`.
3. Click `Edit` for `Work`.
4. Replace `Work` with `Office`.
5. Click `Update`.
6. Verify `Office` is displayed and `Work` is not displayed.

### 4. User deletes an unused category
1. Sign in with unused category `Unused`.
2. Open `/ledger/categories`.
3. Click `Delete` for `Unused`.
4. Verify `Unused` is removed.

### 5. User cannot create a category with a duplicate name
1. Sign in with category `Rent`.
2. Open `/ledger/categories`.
3. Enter `Rent` in the category name field.
4. Click `Create`.
5. Return `category name already exists`.
6. Verify the error and existing `Rent` category are displayed.

### 6. User cannot delete a category in use
1. Sign in with category `Rent` used by transaction `42`.
2. Open `/ledger/categories`.
3. Click `Delete` for `Rent`.
4. Return `category has transactions`.
5. Verify the error and `Rent` category remain displayed.
