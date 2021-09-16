import axios from 'axios'

const login = async user => {
	const response = await axios.post('/api/login', user)
	return response.data
}
const register = async user => {
	const response = await axios.post('/api/register', user)
	return response.data
}

const exports = { login, register }
export default exports