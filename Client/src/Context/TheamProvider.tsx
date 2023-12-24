import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { CustomProvider } from "rsuite";
import "rsuite/dist/rsuite.min.css";

type ThemeContextType = {
    theme: "light" | "dark";
    setMode: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

type ThemeProviderProps = {
    children: ReactNode;
};

export const ThemeProvider = ({ children }: ThemeProviderProps): JSX.Element => {
    const [theme, setTheme] = useState<"light" | "dark">(() => {
        // Retrieve theme value from localStorage or default to "light"
        const storedTheme = localStorage.getItem("theme");
        return storedTheme ? (storedTheme as "light" | "dark") : "light";
    });

    const setMode = (): void => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
    };

    const value: ThemeContextType = { theme, setMode };

    useEffect(() => {
        // Listen for storage events from other tabs/windows
        const handleStorage = (event: StorageEvent) => {
            if (event.key === "theme") {
                const newTheme = event.newValue as "light" | "dark";
                setTheme(newTheme);
            }
        };
        window.addEventListener("storage", handleStorage);
        return () => {
            window.removeEventListener("storage", handleStorage);
        };
    }, []);

    return (
        <ThemeContext.Provider value={value}>
            <CustomProvider theme={theme}>{children}</CustomProvider>
        </ThemeContext.Provider>
    );
};



type UseThemeType = {
    theme: "light" | "dark";
    setMode: () => void;
};

export const useTheme = (): UseThemeType => {
    const context = useContext(ThemeContext);

    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }

    return context;
};