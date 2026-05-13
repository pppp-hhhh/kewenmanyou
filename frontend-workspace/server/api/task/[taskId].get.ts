export default defineEventHandler(async (event) => {
  const taskId = getRouterParam(event, 'taskId')
  const response = await $fetch(`http://localhost:8000/api/task/${taskId}`)
  return response
})
