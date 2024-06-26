import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setUserAvatar: (state, action) => {
            state.user.avatar = action.payload;
        },
        setUserCover: (state, action) => {
            state.user.coverImage = action.payload;
        },
        setName: (state, action) => {
            state.user.name = action.payload;
        },
    },
});

export const { setUser, setUserAvatar,setUserCover,setName } = userSlice.actions;

export default userSlice.reducer;