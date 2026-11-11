# Telegram notifications
## Requirements
* A user can connect a Telegram bot to receive notifications.
* A user can disconnect the Telegram bot.

## User scenarios
### 1. User can see Telegram connection status
1. Sign in as `person@example.com`.
2. Open `/`.
3. Verify `Checking telegram link...` is displayed while the status request is pending.
4. Return `{ "linked": false }` from the Telegram status request.
5. Verify `Telegram not connected` and `Connect Telegram` are displayed.

### 2. User can connect Telegram
1. Sign in as `person@example.com` with Telegram disconnected.
2. Open `/`.
3. Click `Connect Telegram`.
4. Verify a Telegram deep link with a code opens in a new tab.

### 3. User can see the connection complete without reloading
1. Sign in as `person@example.com` with Telegram disconnected.
2. Open `/` and click `Connect Telegram`.
3. Return disconnected status for the immediate check and connected status for the next two-second check.
4. Verify `Telegram connected` and `Disconnect` are displayed without reloading `/`.

### 4. User can disconnect Telegram
1. Sign in as `person@example.com` with Telegram connected.
2. Open `/`.
3. Click `Disconnect`.
4. Verify `Telegram not connected` and `Connect Telegram` are displayed.

### 5. User can see a Telegram configuration error
1. Sign in as `person@example.com`.
2. Open `/`.
3. Return `telegram is not configured` from the Telegram status request.
4. Verify `telegram is not configured` is displayed.
5. Verify `Connect Telegram` and `Disconnect` are hidden.
