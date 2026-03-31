import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { WRITER_TOKEN_STORAGE_KEY, USER_TOKEN_STORAGE_KEY } from "../constants/storageKeys";
import { AppContext } from "./app-context";

const baseURL = import.meta.env.VITE_BASE_URL;
const api = axios.create({ baseURL });
const writerAxios = axios.create({ baseURL });
const userAxios = axios.create({ baseURL });
const applyAuthToken = (client, token) => {
  if (token) {
    client.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }

  delete client.defaults.headers.common.Authorization;
};

const mergeUserPayload = (currentUser, payload) => {
  if (!payload) return currentUser;

  return {
    ...currentUser,
    ...payload,
    savedBlogs: payload.savedBlogs || currentUser?.savedBlogs || [],
    likedBlogs: payload.likedBlogs || currentUser?.likedBlogs || [],
    dislikedBlogs: payload.dislikedBlogs || currentUser?.dislikedBlogs || [],
    followingWriters: payload.followingWriters || currentUser?.followingWriters || []
  };
};

export const AppProvider = ({children})=>{

  const navigate = useNavigate()

  const [writerToken, setWriterToken] = useState(null)
  const [writer, setWriter] = useState(null)
  const [writerProfile, setWriterProfile] = useState(null)
  const [userToken, setUserToken] = useState(null)
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [input, setInput] = useState('')

  const updateBlogInState = (blogId, updatedBlog) => {
    setBlogs((currentBlogs) =>
      currentBlogs.map((blog) => (blog._id === blogId ? { ...blog, ...updatedBlog } : blog))
    );
  };

  const fetchBlogs = useCallback(async ()=>{
    try{
      const {data} = await api.get('/api/blog/all');
      data.success ? setBlogs(data.blogs): toast.error(data.message)

    }catch (error){
       toast.error(error.message)
    }
  }, [])

  const setWriterSession = (token, writerData = null) => {
    localStorage.setItem(WRITER_TOKEN_STORAGE_KEY, token)
    setWriterToken(token)
    setWriter(writerData)
    setWriterProfile(null)
    applyAuthToken(writerAxios, token)
  }

  const logoutWriter = () => {
    localStorage.removeItem(WRITER_TOKEN_STORAGE_KEY)
    setWriterToken(null)
    setWriter(null)
    setWriterProfile(null)
    applyAuthToken(writerAxios, null)
  }

  const setUserSession = (token, userData) => {
    localStorage.setItem(USER_TOKEN_STORAGE_KEY, token)
    setUserToken(token)
    setUser(userData)
    setUserProfile(null)
    applyAuthToken(userAxios, token)
  }

  const logoutUser = () => {
    localStorage.removeItem(USER_TOKEN_STORAGE_KEY)
    setUserToken(null)
    setUser(null)
    setUserProfile(null)
    applyAuthToken(userAxios, null)
  }

  const fetchCurrentUser = useCallback(async () => {
    try {
      const { data } = await userAxios.get('/api/user/me')

      if (!data.success) {
        throw new Error(data.message)
      }

      setUser(data.user)
    } catch {
      logoutUser()
    }
  }, [])

  useEffect(()=>{
    fetchBlogs();

    const savedWriterToken = localStorage.getItem(WRITER_TOKEN_STORAGE_KEY)
    const savedUserToken = localStorage.getItem(USER_TOKEN_STORAGE_KEY)

    if(savedWriterToken){
      setWriterToken(savedWriterToken)
      applyAuthToken(writerAxios, savedWriterToken)
    }

    if(savedUserToken){
      setUserToken(savedUserToken)
      applyAuthToken(userAxios, savedUserToken)
    }
  }, [fetchBlogs])

  useEffect(() => {
    if (userToken) {
      fetchCurrentUser()
    }
  }, [fetchCurrentUser, userToken])

  const fetchWriterProfile = useCallback(async () => {
    const { data } = await writerAxios.get('/api/writer/profile')

    if (!data.success) {
      throw new Error(data.message)
    }

    setWriter(data.profile.writer)
    setWriterProfile(data.profile)
    return data.profile
  }, [])

  useEffect(() => {
    if (writerToken) {
      fetchWriterProfile().catch(() => {
        logoutWriter()
      })
    }
  }, [fetchWriterProfile, writerToken])

  const syncBlogFromResponse = (blog) => {
    updateBlogInState(blog._id, blog);
    return blog;
  };

  const syncUserInteractions = (userPayload) => {
    setUser((currentUser) => mergeUserPayload(currentUser, userPayload))
  }

  const toggleReaction = async (blogId, reaction) => {
    const { data } = await userAxios.post('/api/blog/engagement/toggle', { blogId, action: reaction });

    if (!data.success) {
      throw new Error(data.message);
    }

    syncUserInteractions(data.user)
    return syncBlogFromResponse(data.blog);
  };

  const toggleBookmark = async (blogId) => {
    const { data } = await userAxios.post('/api/blog/engagement/toggle', { blogId, action: 'bookmark' });

    if (!data.success) {
      throw new Error(data.message);
    }

    syncUserInteractions(data.user)
    return syncBlogFromResponse(data.blog);
  };

  const toggleFollowWriter = async (writerId) => {
    const { data } = await userAxios.post('/api/user/follow-writer', { writerId })

    if (!data.success) {
      throw new Error(data.message)
    }

    syncUserInteractions(data.user)
    return data.user
  }

  const incrementShare = async (blogId) => {
    const { data } = await api.post('/api/blog/engagement/share', { blogId });

    if (!data.success) {
      throw new Error(data.message);
    }

    return syncBlogFromResponse(data.blog);
  };

  const signupUser = async (payload) => {
    const { data } = await api.post('/api/user/signup', payload)

    if (!data.success) {
      throw new Error(data.message)
    }

    setUserSession(data.token, data.user)
    return data.user
  }

  const loginUser = async (payload) => {
    const { data } = await api.post('/api/user/login', payload)

    if (!data.success) {
      throw new Error(data.message)
    }

    setUserSession(data.token, data.user)
    return data.user
  }

  const fetchUserProfile = useCallback(async () => {
    const { data } = await userAxios.get('/api/user/profile')

    if (!data.success) {
      throw new Error(data.message)
    }

    setUser(data.profile.user)
    setUserProfile(data.profile)
    return data.profile
  }, [])

  const updateUserPassword = useCallback(async (payload) => {
    const { data } = await userAxios.post('/api/user/update-password', payload)

    if (!data.success) {
      throw new Error(data.message)
    }

    return data.message
  }, [])

  const verifyResetEmail = useCallback(async (email) => {
    const { data } = await api.post('/api/user/verify-reset-email', { email })

    if (!data.success) {
      throw new Error(data.message)
    }

    return data.message
  }, [])

  const resetPassword = useCallback(async (payload) => {
    const { data } = await api.post('/api/user/reset-password', payload)

    if (!data.success) {
      throw new Error(data.message)
    }

    return data.message
  }, [])

  const registerWriter = useCallback(async (payload) => {
    const { data } = await api.post('/api/writer/register', payload)

    if (!data.success) {
      throw new Error(data.message)
    }

    setWriterSession(data.token, data.writer)
    return data.writer
  }, [])

  const loginWriter = useCallback(async (payload) => {
    const { data } = await api.post('/api/writer/login', payload)

    if (!data.success) {
      throw new Error(data.message)
    }

    setWriterSession(data.token, data.writer)
    return data.writer
  }, [])

  const updateWriterPassword = useCallback(async (payload) => {
    const { data } = await writerAxios.post('/api/writer/update-password', payload)

    if (!data.success) {
      throw new Error(data.message)
    }

    return data.message
  }, [])

  const verifyWriterReset = useCallback(async (payload) => {
    const { data } = await api.post('/api/writer/verify-reset', payload)

    if (!data.success) {
      throw new Error(data.message)
    }

    return data.message
  }, [])

  const resetWriterPassword = useCallback(async (payload) => {
    const { data } = await api.post('/api/writer/reset-password', payload)

    if (!data.success) {
      throw new Error(data.message)
    }

    return data.message
  }, [])

  const bookmarkedBlogIds = user?.savedBlogs?.map((blogId) => blogId.toString()) || []
  const followingWriterIds = user?.followingWriters?.map((writerId) => writerId.toString()) || []
  const blogReactions = blogs.reduce((acc, blog) => {
    const blogId = blog._id?.toString()

    if (user?.likedBlogs?.some((likedBlogId) => likedBlogId.toString() === blogId)) {
      acc[blogId] = 'like'
    } else if (user?.dislikedBlogs?.some((dislikedBlogId) => dislikedBlogId.toString() === blogId)) {
      acc[blogId] = 'dislike'
    } else {
      acc[blogId] = null
    }

    return acc
  }, {})

  const value ={
    api,
    writerAxios,
    userAxios,
    navigate,
    writerToken,
    writer,
    writerProfile,
    setWriterSession,
    logoutWriter,
    registerWriter,
    loginWriter,
    fetchWriterProfile,
    updateWriterPassword,
    verifyWriterReset,
    resetWriterPassword,
    userToken,
    user,
    userProfile,
    loginUser,
    signupUser,
    logoutUser,
    fetchUserProfile,
    updateUserPassword,
    verifyResetEmail,
    resetPassword,
    blogs,
    setBlogs,
    input,
    setInput,
    bookmarkedBlogIds,
    followingWriterIds,
    blogReactions,
    updateBlogInState,
    toggleReaction,
    toggleBookmark,
    toggleFollowWriter,
    incrementShare
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}
