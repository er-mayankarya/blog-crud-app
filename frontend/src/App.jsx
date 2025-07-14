import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8000";

function App() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ title: "", content: "" });
  const [editingId, setEditingId] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [showForm, setShowForm] = useState(false);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/read-posts`);
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching posts", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_BASE}/update-posts/${editingId}`, form);
        setFeedback("Post updated successfully.");
      } else {
        await axios.post(`${API_BASE}/create-posts`, form);
        setFeedback("Post created successfully.");
      }
      setForm({ title: "", content: "" });
      setEditingId(null);
      setShowForm(false);
      fetchPosts();
    } catch (err) {
      console.error("Error saving post", err);
      setFeedback("Error saving post.");
    } finally {
      setTimeout(() => setFeedback(""), 2000);
    }
  };

  const handleEdit = (post) => {
    setForm({ title: post.title, content: post.content });
    setEditingId(post.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await axios.delete(`${API_BASE}/delete-posts/${id}`);
      fetchPosts();
      setFeedback("Post deleted.");
    } catch (err) {
      console.error("Error deleting post", err);
      setFeedback("Error deleting post.");
    } finally {
      setTimeout(() => setFeedback(""), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 relative">
      {/* Navbar */}
      <nav className="bg-blue-700 text-white px-6 py-4 shadow z-10 relative">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">📝 Blog Manager</h1>
          <button
            onClick={() => {
              setShowForm(true);
              setForm({ title: "", content: "" });
              setEditingId(null);
            }}
            className="bg-white text-blue-700 px-4 py-2 rounded hover:bg-gray-200 transition"
          >
            Create Post
          </button>
        </div>
      </nav>

      {/* Feedback */}
      {feedback && (
        <div className="mt-4 text-center text-green-700 bg-green-100 border border-green-300 px-4 py-2 rounded max-w-md mx-auto z-10 relative">
          {feedback}
        </div>
      )}

      {/* Main Content (always visible) */}
      <main className="p-6 max-w-6xl mx-auto relative z-0">
        {posts.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">No posts yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white p-5 rounded-lg shadow border border-gray-200 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{post.title}</h3>
                  <p className="text-gray-700 mt-2 text-sm whitespace-pre-line">
                    {post.content}
                  </p>
                </div>
                <div className="mt-4 flex justify-between text-sm">
                  <button
                    onClick={() => handleEdit(post)}
                    className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Overlay + Post Form */}
      {showForm && (
        <div className="fixed inset-0 bg-white/70 backdrop-blur-sm z-20 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative z-30 border border-gray-400">
            <h2 className="text-xl font-semibold text-center mb-4">
              {editingId ? "✏️ Edit Post" : "➕ Add Post"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
              <textarea
                placeholder="Content"
                className="w-full p-2 border rounded h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                required
              />
              <div className="flex justify-center space-x-3">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {editingId ? "Update" : "Add"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm({ title: "", content: "" });
                    setShowForm(false);
                  }}
                  className="text-gray-600 hover:underline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
