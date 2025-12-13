import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Projects } from "./pages/Projects";
import { GetInvolved } from "./pages/GetInvolved";
import { Donate } from "./pages/Donate";
import { Gallery } from "./pages/Gallery";
import { Events } from "./pages/Events";
import { Blog } from "./pages/Blog";
import { BlogPost } from "./pages/BlogPost";
import { Contact } from "./pages/Contact";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="projects" element={<Projects />} />
        <Route path="get-involved" element={<GetInvolved />} />
        <Route path="donate" element={<Donate />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="events" element={<Events />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:slug" element={<BlogPost />} />
        <Route path="contact" element={<Contact />} />
      </Route>
    </Routes>
  );
}