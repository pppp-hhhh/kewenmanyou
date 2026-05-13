export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const response = await $fetch(`http://localhost:8000/api/works/${id}/export`, {
    method: 'GET',
    responseType: 'blob',
  })
  return response
})
