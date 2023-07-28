import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { updatePost, selectpostById, deletePost } from './postsSlice'

import { useSelector, useDispatch } from 'react-redux'
import { selectAllUsers } from '../users/usersSlice'

export default function EditPostForm() {

    const { postId } = useParams()

    const navigate = useNavigate()


    const post = useSelector((state) => selectpostById(state, Number(postId)))

    const users = useSelector(selectAllUsers)



    const [title, setTitle] = useState(post?.title);
    const [content, setContent] = useState(post?.body);
    const [userId, setUserId] = useState(post?.userId);
    const [requestStatus, setRequestStatus] = useState('idle');


    const dispatch = useDispatch()


    if (!post) {
        return (
            <section>
                <h2>Post not found!</h2>
            </section>
        )
    }

    const onTitleChanged = e => setTitle(e.target.value)
    const onContentChanged = e => setContent(e.target.value)
    const onAuthorChanged = e => setUserId(Number(e.target.value))


    const canSave = [title, content, userId].every(Boolean) && requestStatus === 'idle'

    const onUpdatePostClicked = () => {
        if (canSave) {
            try {
                setRequestStatus('pending')
                dispatch(updatePost({ id: post.id, title, body: content, userId, reactions: post.reactions }))

                setTitle('')
                setContent('')
                setUserId('')
                navigate(`/post/${postId}`)
            } catch (err) {
                console.log('Falied to save the post', err);
            } finally {
                setRequestStatus('idle')
            }
        }
    }


    const usersOptions = users.map(user => (
        <option key={user.id} value={user.id}>
            {user.name}
        </option>
    ))

    const onDeletePostClicked = () => {
        try {
            setRequestStatus('pending')
            dispatch(deletePost({ id: post.id }))

            setTitle('')
            setContent('')
            setUserId('')
            navigate("/")

        }
        catch (err) {
            console.log('Failed to delete post', err);
        } finally {
            setRequestStatus('idle')
        }
    }

    return (
        <section>
            <h2>Edit Post</h2>
            <form>
                <label htmlFor="postTitle">Post Title:</label>
                <input
                    type="text"
                    id="postTitle"
                    name="postTitle"
                    value={title}
                    onChange={onTitleChanged}
                />
                <label htmlFor="postAuthor">Author:</label>
                <select id="postAuthor" value={userId} onChange={onAuthorChanged} defaultValue={userId}>
                    <option value=""></option>
                    {usersOptions}
                </select>
                <label htmlFor="postContent">Content:</label>
                <textarea
                    id="postContent"
                    name="postContent"
                    value={content}
                    onChange={onContentChanged}
                />
                <button
                    type="button"
                    onClick={onUpdatePostClicked}
                    disabled={!canSave}
                >Edit Post</button>

                <button
                    type="button"
                    onClick={onDeletePostClicked}
                    disabled={!canSave}
                >Delete Post</button>
            </form>
        </section>
    )
}
