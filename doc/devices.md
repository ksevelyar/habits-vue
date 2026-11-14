# Devices
## Requirements
* Creating a device requires a name.
* After creation, the app shows a generated device ID and token.
* The device ID and token are shown in read-only fields.

## User scenarios
### 1. User creates a device and views its ID and token
1. Sign in as `person@example.com`.
2. Open `/devices/new`.
3. Enter `Kitchen timer` as the device name.
4. Click `Add`.
5. Verify the read-only device ID field contains `device-123` and the read-only token field contains `secret-token`.
