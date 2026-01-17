import { IconButton, Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { themeAction } from "@/redux/slices/theme";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { RootState } from "@/redux/store";

interface ThemeToggleProps {
    className?: string;
}

const ThemeToggle = ({ className }: ThemeToggleProps) => {
    const dispatch = useDispatch();

    // 1. Read the current mode
    const { mode } = useSelector((state: RootState) => state.themeReducer);

    // 2. Function to toggle
    const handleToggle = () => {
        const newMode = mode === "dark" ? "light" : "dark";
        dispatch(themeAction({ mode: newMode }));
    };

    return (
        <Tooltip title={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}>
            <IconButton onClick={handleToggle} color="inherit" className={className}>
                {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
        </Tooltip>
    );
};

export default ThemeToggle;
