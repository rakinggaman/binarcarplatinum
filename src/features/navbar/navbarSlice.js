import { createSlice } from '@reduxjs/toolkit'


export const navbarSlice = createSlice({
  name: 'navbar',
  initialState: {
      show: false,
  },
  reducers: {
    hidden: (state) => {
     state.show = !state.show
    },

  },
})

export const { hidden } = navbarSlice.actions

export default navbarSlice.reducer
