# Telegram notifications

## Connect
1. User opens the dashboard; the client fetches the link status via `GET /telegram/link`
2. User clicks "Connect Telegram"; the client requests a one-time code from the backend via `POST /telegram/link` and opens the returned bot url in a new browser tab; the user clicks "Start Bot"
3. The bot replies "Linked ✓" and saves the link. The client polls `GET /telegram/link` every 2 seconds until the link appears, so the status line changes to "Telegram connected" reactively.

## Disconnect
1. User opens the dashboard and clicks "Disconnect"; the client sends `DELETE /telegram/link`
2. The block switches to "Telegram not connected"
