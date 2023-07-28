import { createSlice, nanoid } from "@reduxjs/toolkit";



const initialState = [
    { id: '0', name: "Akash jaiswal" },
    { id: '1', name: "Arinha Adhikaari" },
    { id: '2', name: "Kuki Kumari" }
]




const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {

    }
})

export const selectAllUsers = (state) => state.users;


export default usersSlice.reducer