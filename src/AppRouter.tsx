import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ScrollToTop } from "./components/ScrollToTop";
import { Layout } from "./components/Layout";

import About from "./pages/About";
import Blog from "./pages/Blog";
import Notes from "./pages/Notes";
import CV from "./pages/CV";
import { NIP19Page } from "./pages/NIP19Page";
import NotFound from "./pages/NotFound";

export function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout><About /></Layout>} />
        <Route path="/blog" element={<Layout><Blog /></Layout>} />
        <Route path="/notes" element={<Layout><Notes /></Layout>} />
        <Route path="/cv" element={<Layout><CV /></Layout>} />
        {/* NIP-19 route for npub1, note1, naddr1, nevent1, nprofile1 */}
        <Route path="/:nip19" element={<NIP19Page />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
export default AppRouter;