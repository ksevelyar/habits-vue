# Tasks

## Requirements
* A task schedules recurring notifications using a cron expression and sends them through connected channels, such as Telegram and WebSocket clients.
* Users can create, update, activate, and deactivate tasks.
* A task has a name, cron expression, and active state.

## User scenarios

### 1. User can view tasks
* The task list shows the user's tasks.

### 2. User can create a scheduled task
* The user enters a task name and cron expression and can enable the task.
* After creation, the task's edit page opens.

### 3. User can update a scheduled task
* The edit form loads the selected task and lets the user change its fields.
* Saving returns the user to the task list.

### 4. User can activate or deactivate a scheduled task
* The user changes a task's active state in the create or edit form and saves it.
