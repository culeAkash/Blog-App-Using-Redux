import { createSlice, nanoid, createAsyncThunk } from "@reduxjs/toolkit";
import { sub } from 'date-fns';

import axios from 'axios'


const POST_URL = 'https://jsonplaceholder.typicode.com/posts'

const initialState = {
    posts: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed
    error: null
}


export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    try {
        const response = await axios.get(POST_URL)
        return response.data
    } catch (error) {
        return error.message
    }
})


export const addNewPost = createAsyncThunk('posts/addNewPost', async (initialPost) => {
    try {
        const response = await axios.post(POST_URL, initialPost)
        return response.data
    } catch (error) {
        return error.message
    }
})


export const updatePost = createAsyncThunk('posts/updatePost', async (initialPost) => {
    const { id } = initialPost
    try {
        const response = await axios.put(`${POST_URL}/${id}`, initialPost)
        return response.data
    } catch (error) {
        // return error.message
        return initialPost; //only for testing redux
    }
})


export const deletePost = createAsyncThunk('posts/deletePost', async (initialPost) => {
    const { id } = initialPost
    try {
        const response = await axios.delete(`${POST_URL}/${id}`)
        if (response?.status === 200) return initialPost
        return `${response?.status}:${response?.statusText}`;
    } catch (error) {
        return error.message
    }
})


const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        postAdded: {
            reducer(state, action) {
                state.posts.push(action.payload)
            },
            prepare(title, body, userId) {
                return {
                    payload: {
                        id: nanoid(),
                        title,
                        body,
                        date: new Date().toISOString(),
                        userId,
                        reactions: {
                            thumbsUp: 0,
                            wow: 0,
                            heart: 0,
                            rocket: 0,
                            coffee: 0
                        }
                    }
                }
            }
        },
        reactionAdded(state, action) {
            const { postId, reaction } = action.payload
            const existingPost = state.posts.find(post => post.id === postId)
            if (existingPost) {
                existingPost.reactions[reaction]++
            }
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchPosts.pending, (state, { payload }) => {
                state.status = 'loading'
            })
            .addCase(fetchPosts.fulfilled, (state, { payload }) => {
                state.status = 'succeeded'
                let min = 1
                //adding date and reactions as api doesn't contain it
                const loadedPosts = payload.map(post => {
                    post.date = sub(new Date(), { minutes: min++ }).toISOString()
                    post.reactions = {
                        thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0
                    }
                    console.log(post);
                    return post
                })
                //add to the state
                state.posts = loadedPosts
            })
            .addCase(fetchPosts.rejected, (state, { error }) => {
                state.status = 'failed'
                state.error = error
            })
            .addCase(addNewPost.fulfilled, (state, { payload }) => {
                payload.userId = Number(payload.userId)
                payload.date = new Date().toISOString()
                payload.reactions = {
                    thumbsUp: 0,
                    wow: 0,
                    heart: 0,
                    rocket: 0,
                    coffee: 0
                }

                state.posts.push(payload)
            })
            .addCase(updatePost.fulfilled, (state, { payload }) => {

                console.log(payload);

                if (!payload?.id) {
                    console.log('Update could not complete');
                    console.log(payload);
                    return
                }

                const { id } = payload

                payload.date = new Date().toISOString()

                const posts = state.posts.filter(post => post.id !== id)

                state.posts = [...posts, payload]
            })
            .addCase(deletePost.fulfilled, (state, { payload }) => {
                if (!payload?.id) {
                    console.log('Delete could not complete');
                    console.log(payload);
                    return
                }

                const { id } = payload

                // payload.date = new Date().toISOString()

                const posts = state.posts.filter(post => post.id !== id)

                state.posts = posts

            })
    }
})

export const selectAllPosts = (state) => state.posts.posts;
export const getPostsStatus = (state) => state.posts.status;
export const getPostsError = (state) => state.posts.error


// select statement for select post by id
export const selectpostById = (state, postId) =>
    state.posts.posts.find(post => post.id === postId)

export const { postAdded, reactionAdded } = postsSlice.actions

export default postsSlice.reducer