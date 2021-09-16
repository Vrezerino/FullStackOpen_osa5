import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import blogService from './services/blogService'

const App = () => {
	const [user, setUser] = useState(null)
	const [blogs, setBlogs] = useState([])
	const [loggedIn, setLoggedIn] = useState(false)

	const logout = () => {
		setUser(null)
		window.localStorage.removeItem('loggedInUser')
	}

	const blogFormRef = useRef()
	let sortedBlogs

	useEffect(() => {
		blogService.getAll().then(blogs => {
			sortedBlogs = blogs.sort((b1, b2) => b2.likes - b1.likes)
			setBlogs(sortedBlogs)}
		)
	}, [])

	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem('loggedInUser')
		if (loggedUserJSON) {
			const parsedUser = JSON.parse(loggedUserJSON)
			setUser(parsedUser)
			setLoggedIn(true)
			blogService.setToken(parsedUser.token)
		}
	}, [loggedIn])

	const postBlog = async (newBlog) => {
		try {
			const savedBlog = await blogService.postNew(newBlog)
			setBlogs(blogs.concat(savedBlog))
			blogFormRef.current.resetFields()
			blogFormRef.current.setFormOpened(false)
		} catch (e) {
			blogFormRef.current.setNotif('All fields are required!')
		} setTimeout(() => {
			blogFormRef.current.setNotif(null)
		}, 3000)
	}

	if (user) {
		return (
			<section>
				<h2>Interesting blogs</h2>

				{blogs.map(blog =>
					<Blog key={blog.id}
						blog={blog}
						blogs={blogs}
						setBlogs={setBlogs}
						userID={user.id}/>
				)}

				<BlogForm ref={blogFormRef}
					postBlog={postBlog}
					blogs={blogs}
					setBlogs={setBlogs}
					userID={user.id} />

				<hr />

				<button type='button'
					id='logoutBtn'
					className='logoutBtn'
					onClick={logout}>Log Out</button>
			</section>
		)
	} else {
		return (
			<section>
				<LoginForm setUser={setUser} setLoggedIn={setLoggedIn} />
			</section>
		)
	}
}

export default App