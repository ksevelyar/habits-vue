# Sessions
## Requirements
* `/login` and `/register` are accessible without an authenticated session.
* Every other page requires an authenticated session; unauthenticated users are redirected to `/login`.
* Only a 401 response from the current-session endpoint indicates an unauthenticated session; network and other server errors do not trigger a login redirect.
