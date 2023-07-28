import { createSlice, nanoid } from '@reduxjs/toolkit'

import { sub } from 'date-fns'


const initialState = [
    {
        id: '1',
        title: 'Learning Redux Toolkit',
        content: "I'm learning how to use the redux toolkit library. It's a great way to manage state in react app",
        date: sub(new Date(), { minutes: 10 }).toISOString(),
        reactions: {
            thumbsup: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0
        }
    },
    {
        id: '2',
        title: "Understanding React's Context API",
        content: "Context API is a great alternative for redux",
        date: sub(new Date(), { minutes: 5 }).toISOString(),
        reactions: {
            thumbsup: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0
        }
    }
]

// * We can change the state directly by pushing as redux uses emmer.js in the background and push is equialent to creating new state

export const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        postsAdded: {
            reducer: (state, { payload }) => {
                state.push(payload)
            },
            prepare: (title, content, userId) => {
                return {
                    payload: {
                        id: nanoid(),
                        title,
                        content,
                        userId,
                        date: new Date().toISOString(),
                        reactions: {
                            thumbsup: 0,
                            wow: 0,
                            heart: 0,
                            rocket: 0,
                            coffee: 0
                        }
                    }
                }
            }
        },
        reactionAdded: (state, { payload }) => {
            const { postId, reaction } = payload

            const exisitingPost = state.find(post => post.id === postId)

            if (exisitingPost) {
                exisitingPost.reactions[reaction]++;
            }
        }
    }
})


// if shape of the state ever changes, we have to change it here only
export const selectAllPosts = (state) => state.posts;

export const { postsAdded, reactionAdded } = postsSlice.actions


export default postsSlice.reducer