# Telegram notifications

## Requirements
* The dashboard checks the Telegram connection status when it loads.
* When the status check reports the account is not connected, the dashboard checks again every two seconds until it connects or a request fails.
* Connecting requests a one-time URL, opens it in a new tab, and immediately checks the connection status.
* Disconnecting removes the Telegram connection and displays the disconnected status.
* The dashboard shows backend errors as status messages and stops checking after a request fails.
* The scheduled check is cleared when the dashboard closes.

## User scenarios

### 1. User can see Telegram connection status
* The status shows a checking message while the connection status loads.
* The status shows whether Telegram is connected.

### 2. User can connect Telegram
* When Telegram is not connected, the user can request a link and open it in a new tab.

### 3. User can see the connection complete without reloading
* After requesting a link, the client checks immediately and repeats every two seconds while Telegram remains disconnected.
* When a check reports a connection, the dashboard shows Telegram as connected.

### 4. User can disconnect Telegram
* Disconnecting removes the connection and shows Telegram as not connected.

### 5. User can see a Telegram configuration error
* If a Telegram request fails, the returned error message is shown and connection actions are hidden.
