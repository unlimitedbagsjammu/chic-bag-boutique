import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ThemeState {
    mode: "light" | "dark";
}

// Check system preference or persisted state
const getInitialMode = (): "light" | "dark" => {
    const savedMode = localStorage.getItem("theme");
    if (savedMode === "light" || savedMode === "dark") {
        return savedMode;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const initialState: ThemeState = {
    mode: getInitialMode(),
};

const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        themeAction: (state, action: PayloadAction<{ mode: "light" | "dark" }>) => {
            state.mode = action.payload.mode;
            localStorage.setItem("theme", action.payload.mode);
        },
    },
});

export const { themeAction } = themeSlice.actions;
export default themeSlice.reducer;
