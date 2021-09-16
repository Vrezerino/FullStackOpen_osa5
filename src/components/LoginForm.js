import userService from '../services/userService'
import blogService from '../services/blogService'
import React, { useState } from 'react'
import './LoginForm.css'

const LoginForm = (props) => {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [notif, setNotif] = useState(null)

	const handleLogin = async (event) => {
		event.preventDefault()
		try {
			const user = await userService.login({
				username, password
			})
			window.localStorage.setItem('loggedInUser', JSON.stringify(user))
			blogService.setToken(user.token)
			props.setUser(user)
			props.setLoggedIn(true)
		} catch (e) {
			if (e.message.includes('401')) {
				setNotif('Invalid username or password!')
			} else {
				setNotif('Server or connection error!')
			} setTimeout(() => {
				setNotif(null)
			}, 3000)
		}
	}
	return (
		<div className='loginForm'>
			<form onSubmit={handleLogin}>
				<table>
					<thead>
						<tr>
							<td>
								<h1>{notif || 'Log in first!'}</h1>
							</td>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>
								<input hidden
									type='text'
									placeholder='Username'
									autoComplete='username'
									value={username}
									readOnly />
							</td>
						</tr>
						<tr>
							<td>
								<input type='username'
									id='username'
									autoComplete='username'
									value={username}
									name='Username'
									onChange={({ target }) =>
										setUsername(target.value)} />
							</td>
						</tr>
						<tr>
							<td>
								<input type='password'
									id='password'
									placeholder='Password'
									autoComplete='new-password'
									value={password}
									name='Password'
									onChange={({ target }) =>
										setPassword(target.value)} />
							</td>
						</tr>
						<tr>
							<td>
								<button type='submit'>Go!</button>
							</td>
						</tr>
					</tbody>
				</table>
			</form>
		</div>
	)
}

export default LoginForm