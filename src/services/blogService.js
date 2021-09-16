import axios from 'axios'
const baseUrl = '/api/blogs'
let token = null

const setToken = newToken => {
	token = `bearer ${newToken}`
}

const getAll = async () => {
	const response = await axios.get(baseUrl)
	return response.data
}

const postNew = async newBlog => {
	const response = await axios.post(baseUrl, newBlog, { headers: { Authorization: token } })
	return response.data
}

const deleteBlog = async id => {
	const response = await axios.delete(baseUrl + '/' + id, { headers: { Authorization: token } })
	return response.data
}
const voteBlog = async (id, votes) => {
	const response = await axios.put(baseUrl + '/' + id, votes)
	return response.data
}

const exports = { setToken, getAll, postNew, deleteBlog, voteBlog }
export default exports