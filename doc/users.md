# Users

## Requirements
* Registration requires an email address, handle, password, and timezone.
* Sign-in requires an email address and password.
* The login and registration routes are public.
* All other routes require an active session.

## User scenarios

### 1. User can register with email, handle, password, and timezone
* The registration form collects an email address, handle, password, and timezone. The timezone is prefilled from the browser.
* After registration, the user is sent to the dashboard.

### 2. User can sign in with email and password
* The sign-in form collects an email address and password.
* After signing in, the user is sent to the dashboard.

### 3. Unauthenticated user is redirected to sign in from protected pages
* Visiting a protected route checks for an active session.
* A 401 response redirects the user to `/login`.

### 4. User can access sign in and registration without a session
* The `/login` and `/register` routes do not check for an active session.
