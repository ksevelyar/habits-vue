# Users
## Requirements
* Registration requires an email address, handle, password, and time zone.
* Sign-in requires an email address and password.
* The sign-in and registration routes are public.
* All other routes require an active session.

## User scenarios
### 1. User registers with an email address, handle, password, and time zone
1. Set the browser timezone to `Europe/Moscow`.
2. Open `/register`.
3. Verify the time zone field contains `Europe/Moscow`.
4. Enter `person@example.com` in email, `person` in handle, and `secret` in password.
5. Click `Register`.
6. Verify `/` opens.

### 2. User signs in with an email address and password
1. Register `person@example.com` with password `secret`.
2. Open `/login`.
3. Enter `person@example.com` in email and `secret` in password.
4. Click `Sign in`.
5. Verify `/` opens.

### 3. An unauthenticated user is redirected to sign in from protected pages
1. Clear the session cookie.
2. Open `/chains`.
3. Return `401 unauthorized` for the current-user request.
4. Verify `/login` opens and displays the email and password fields.

### 4. User accesses the sign-in page without a session
1. Clear the session cookie.
2. Open `/login`.
3. Verify the email, password, and `Sign in` controls are displayed.

### 5. User accesses the registration page without a session
1. Clear the session cookie.
2. Open `/register`.
3. Verify the email, handle, password, time zone, and `Register` controls are displayed.
