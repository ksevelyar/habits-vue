import { setupServer } from 'msw/node'

export function mock(...requestHandlers) {
  const mockedServer = setupServer(...requestHandlers)
  mockedServer.listen({ onUnhandledRequest: 'error' })

  return mockedServer
}
