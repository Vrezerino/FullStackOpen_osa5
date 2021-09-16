import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent, screen } from '@testing-library/react'
import Blog from '../components/Blog'
import BlogForm from './BlogForm'
import helper from './testhelper'

let blog
const mockFn = jest.fn()

beforeEach(() => {
	blog = render(
		<Blog blog={helper.blogs[0]}
			blogs={helper.blogs}
			userID={helper.userID}
			setBlogs={mockFn} />
	)
})

describe('Blog', () => {
	test('title and author only are rendered initially', () => {
		const title = blog.container.querySelector('#title')
		const author = blog.container.querySelector('#author')
		const url = blog.container.querySelector('#url')
		const likes = blog.container.querySelector('#likes')

		expect(title).toBeDefined()
		expect(author).toBeDefined()
		expect(url).toBeNull()
		expect(likes).toBeNull()
	})

	test('url and likes are visible when blog contents are viewed', () => {
		const viewBlogBtn = blog.container.querySelector('#viewBlog')
		fireEvent.click(viewBlogBtn)

		const url = blog.container.querySelector('#url')
		const likes = blog.container.querySelector('#likes')

		expect(url).toBeDefined()
		expect(likes).toBeDefined()
	})

	test('mock fn is called twice when like button is pressed twice', () => {
		const viewBlogBtn = blog.container.querySelector('#viewBlog')
		fireEvent.click(viewBlogBtn)

		const likeBtn = blog.container.querySelector('#likeBtn')

		fireEvent.click(likeBtn)
		fireEvent.click(likeBtn)

		expect(mockFn.mock.calls).toHaveLength(2)
	})
})

describe('BlogForm', () => {
	test('calls mock function upon posting a new blog', () => {

		const blogForm = render(
			<BlogForm blogs={helper.blogs}
				postBlog={mockFn}
				userID={helper.userID} />
		)

		const postBtn = blogForm.container.querySelector('#postBtn')
		fireEvent.click(postBtn)

		const form = blogForm.container.querySelector('form')

		const authorInput = screen.getByPlaceholderText('Author')
		const titleInput = screen.getByPlaceholderText('Title')
		const urlInput = screen.getByPlaceholderText('URL')

		fireEvent.change(authorInput, { target: { value: 'Test Author!' } })
		fireEvent.change(titleInput, { target: { value: 'Test Title!' } })
		fireEvent.change(urlInput, { target: { value: 'testurl.fi' } })

		fireEvent.submit(form)

		expect(mockFn.mock.calls).toHaveLength(1)

		expect(mockFn.mock.calls[0][0].author).toBe('Test Author!')
		expect(mockFn.mock.calls[0][0].title).toBe('Test Title!')
		expect(mockFn.mock.calls[0][0].url).toBe('http://testurl.fi')
	})
})