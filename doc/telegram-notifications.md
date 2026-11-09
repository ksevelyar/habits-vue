# Telegram notifications

## Requirements
* The dashboard checks the Telegram connection status when it loads.
* While the account is not connected, the dashboard checks again every two seconds.
* Connecting requests a one-time URL and opens it in a new tab.
* Disconnecting removes the Telegram connection.
* The dashboard shows backend errors as status messages.
* Connection checks stop when the dashboard is closed.

## User scenarios

### 1. User can see Telegram connection status
* The status shows a checking message while the connection status loads.
* The status shows whether Telegram is connected.

### 2. User can connect Telegram
* When Telegram is not connected, the user can request a link and open it in a new tab.

### 3. User can see the connection complete without reloading
* The client checks until the connection is complete and then shows Telegram as connected.

### 4. User can disconnect Telegram
* Disconnecting removes the connection and shows Telegram as not connected.

### 5. User can see a Telegram configuration error
* If a Telegram request fails, the returned error message is shown and connection actions are hidden.
