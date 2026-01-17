import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { CartSheet } from "@/components/CartSheet";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Checkout from "./pages/Checkout";

const queryClient = new QueryClient();

import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useEffect, useMemo } from "react";

const App = () => {
  const { mode } = useSelector((state: RootState) => state.themeReducer);

  // Sync with Tailwind
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(mode);
  }, [mode]);

  // Create MUI theme
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: mode,
          ...(mode === "light"
            ? {
              // Luxury Light Palette
              primary: {
                main: '#C59A5A', // Muted Gold
              },
              background: {
                default: '#F5EFE5', // Warm Cream
                paper: '#FAF6F0',   // Lighter Cream
              },
              text: {
                primary: '#111111', // Rich Black
                secondary: '#666666', // Soft Gray
              },
            }
            : {
              // Dark mode - Premium Luxury
              background: {
                default: "#141414", // Deep Charcoal
                paper: "#1C1C1C",   // Lighter Charcoal
              },
              text: {
                primary: "#F5F1E8", // Warm Beige
                secondary: "#A8A29E", // Warm Grey
              },
              primary: {
                main: "#D4AF37",    // Classic Gold
              }
            }),
        },
        typography: {
          fontFamily: `"DM Sans", "sans-serif"`,
          h1: { fontFamily: `"Playfair Display", serif` },
          h2: { fontFamily: `"Playfair Display", serif` },
          h3: { fontFamily: `"Playfair Display", serif` },
          h4: { fontFamily: `"Playfair Display", serif` },
          button: { textTransform: 'none' }
        }
      }),
    [mode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <CartSheet />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/shop/:id" element={<ProductDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
