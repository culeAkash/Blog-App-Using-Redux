import React from 'react'

import { selectpostById } from './postsSlice'
import { useSelector } from 'react-redux'


import PostAuthor from './PostAuthor'
import TimeAgo from './TimeAgo'
import ReactionButtons from './ReactionButtons'

import { Link, useParams, userParams } from 'react-router-dom'


export default function SinglePostPage() {
    //retrieve id
    const { postId } = useParams()

    const post = useSelector((state) => selectpostById(state, Number(postId)))

    if (!post) {
        return (
            <section>
                <h2>Post not found!</h2>
            </section>
        )
    }


    console.log(post);

    return (
        <article>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
            <p className="postCredit">
                <Link to={`/post/edit/${post.id}`}>Edit Post</Link>
                <PostAuthor userId={post.userId} />
                <TimeAgo timestamp={post.date} />
            </p>
            <ReactionButtons post={post} />
        </article>
    )
}
