export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  const response = await $fetch(`/api/works/${id}`, {
    method: 'DELETE',
    baseURL: 'http://localhost:8000',
  })

  return response
})
