export default defineEventHandler(async (event) => {
  const workId = getRouterParam(event, 'workId')
  const response = await $fetch(`http://localhost:8000/api/works/${workId}/export`, {
    method: 'GET',
    responseType: 'blob',
  })
  return response
})
