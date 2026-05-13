export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const response = await $fetch('/api/lessons', {
    method: 'POST',
    body,
    baseURL: 'http://localhost:8000',
  })

  return response
})
