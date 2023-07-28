import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'

const BASE_URL = 'https://jsonplaceholder.typicode.com/users'

const initialState = {
    users: [],
    status: 'idle',
    error: null
}

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    try {
        const response = await axios.get(BASE_URL)
        return [...response.data]
    } catch (error) {
        return error.message
    }
})



const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            // .addCase(fetchUsers.pending, (state, action) => {
            //     state.status = 'loading'
            // })
            .addCase(fetchUsers.fulfilled, (state, { payload }) => {
                state.status = 'succeeded'

                state.users = payload
            })
        // .addCase(fetchUsers.rejected, (state, { error }) => {
        //     state.status = 'failed'
        //     state.error = error
        // })
    }
})

export const selectAllUsers = (state) => state.users.users;

export default usersSlice.reducer