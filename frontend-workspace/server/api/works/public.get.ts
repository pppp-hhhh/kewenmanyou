export default defineEventHandler(async (event) => {
  const response = await $fetch('http://localhost:8000/api/works/public')
  return response
})
