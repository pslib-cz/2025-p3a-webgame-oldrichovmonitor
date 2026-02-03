import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";

// Generate or retrieve User ID
const getUserId = () => {
    let userId = localStorage.getItem('swing_user_id');
    if (!userId) {
        userId = crypto.randomUUID();
        localStorage.setItem('swing_user_id', userId);
    }
    return userId;
};

// Global Fetch Interceptor
const originalFetch = window.fetch;
window.fetch = async (input, init) => {
    const userId = getUserId();
    
    init = init || {};
    init.headers = init.headers || {};
    
    if (init.headers instanceof Headers) {
        init.headers.append('X-User-Id', userId);
    } else if (Array.isArray(init.headers)) {
        init.headers.push(['X-User-Id', userId]);
    } else {
        // @ts-ignore
        init.headers['X-User-Id'] = userId;
    }

    return originalFetch(input, init);
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
