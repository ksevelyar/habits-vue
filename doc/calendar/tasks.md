# Tasks
## Requirements
* A task schedules recurring notifications using a cron expression and sends them through connected channels, such as Telegram and WebSocket clients.
* Users can create, update, activate, and deactivate tasks.
* A task has a name, cron expression, and active state.

## User scenarios
### 1. User views tasks
1. Sign in as `person@example.com` with task `42`, named `Take a walk`, using cron `0 9 * * *`.
2. Open `/tasks`.
3. Verify `Take a walk` is displayed.

### 2. User creates a scheduled task
1. Sign in as `person@example.com`.
2. Open `/tasks/new`.
3. Enter `Take a walk` as the name and `0 9 * * *` as the cron expression.
4. Check `Active`.
5. Click `Add`.
6. Verify `/tasks/42/edit` opens and shows `Take a walk`, `0 9 * * *`, and checked `Active`.

### 3. User updates a scheduled task
1. Sign in with active task `42`, named `Take a walk`, using cron `0 9 * * *`.
2. Open `/tasks/42/edit`.
3. Verify `Take a walk`, `0 9 * * *`, and checked `Active` are displayed.
4. Change the cron expression to `0 8 * * *`.
5. Click `Save`.
6. Verify `/tasks` opens and lists `Take a walk`.

### 4. User activates or deactivates a scheduled task
1. Sign in with inactive task `42`, named `Take a walk`, using cron `0 9 * * *`.
2. Open `/tasks/42/edit`.
3. Check `Active`.
4. Click `Save`.
5. Reopen `/tasks/42/edit`.
6. Verify `Active` is checked.
