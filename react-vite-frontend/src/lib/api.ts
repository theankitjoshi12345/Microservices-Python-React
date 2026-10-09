export const ADMIN_API_URL = 'http://localhost:8000/api'
export const MAIN_API_URL = 'http://localhost:8001/api'

export async function getErrorMessage(response: Response): Promise<string> {
  try {
    const data: unknown = await response.json()
    if (typeof data === 'object' && data !== null) {
      return Object.values(data).flat().join(' ') || response.statusText
    }
  } catch {
    // The API can return an empty response for successful deletes.
  }

  return response.statusText || 'Something went wrong.'
}
