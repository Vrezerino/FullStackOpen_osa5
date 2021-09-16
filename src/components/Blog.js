/* eslint-disable no-undef */
import React, { useState } from 'react'
import blogService from '../services/blogService'
import './Blog.css'
import PropTypes from 'prop-types'

const Blog = ({ blog, blogs, setBlogs, userID }) => {
	const loggedUserID = userID
	const [blogOpened, setBlogOpened] = useState(false)

	const addLike = async () => {
		if (process.env.NODE_ENV !== 'test') {
			const updatedPost = {
				title: blog.title,
				author: blog.author,
				url: blog.blogUrl,
				likes: blog.likes + 1
			}
			try {
				const votedBlog = await blogService.voteBlog(blog.id, updatedPost)
				setBlogs(blogs.map(b => b.id === votedBlog.id ? votedBlog : b))
			} catch (e) {
				console.log(e.message)
			}
		} else {
			setBlogs(null)
		}
	}

	const deleteBlog = async () => {
		if (window.confirm(`Remove ${blog.title} by ${blog.author}?`)) {
			try {
				await blogService.deleteBlog(blog.id)
				setBlogs(blogs.flatMap(b => b.id !== blog.id ? b : []))
			} catch (e) {
				console.log(e.message)
			}
		}
	}

	Blog.propTypes = {
		blog: PropTypes.object.isRequired,
		blogs: PropTypes.array.isRequired,
		setBlogs: PropTypes.func.isRequired,
		userID: PropTypes.string.isRequired
	}

	if (blogOpened) {
		return (
			<div className='blog'>
				{loggedUserID === blog.user
					? <button id='deleteBlog' alt='remove this blog' onClick={deleteBlog}>X</button>
					: null}
				<ul>
					<button id='closeBlog' alt='close this blog' onClick={() => setBlogOpened(false)}>Hide</button>
					<li id='title'>Title: <b>{blog.title}</b></li>
					<li id='author'>Author: <b>{blog.author}</b></li>
					<li id='url'>URL: <a href={blog.url}><b>{blog.url}</b></a></li>
					<li id='likes'>Likes: <b>{blog.likes}</b>
						<img id='likeBtn' alt="thumbs up icon" src="thumbsup.png" onClick={addLike} />
					</li>
				</ul>
			</div>
		)
	} else {
		return (
			<div className='blog'>
				<span id='title'><b>{blog.title}</b></span> by <span id='author'>{blog.author}</span>
				<button id='viewBlog' alt='view blog contents' onClick={() => setBlogOpened(true)}>View</button>
			</div>
		)
	}
}

export default Blog