export default defineEventHandler(async () => {
  const response = await $fetch('http://localhost:8000/api/works', {
    method: 'GET',
  })
  return response
})
