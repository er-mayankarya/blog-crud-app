from fastapi import FastAPI, Request
from app.db import get_master_conn, get_slave_conn
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return "Welcome to the Project"

#Create Operation
@app.post("/create-posts")
async def create_post(request: Request):
    data = await request.json()
    title = data.get("title")
    content = data.get("content")

    connection = get_master_conn()
    current = conn.cursor()
    current.execute("INSERT INTO posts (title, content) VALUES (%s, %s)", (title, content))
    connection.commit()
    current.close()
    connection.close()

    return {"message": "Post created"}

#Read Operation
@app.get("/read-posts")
async def list_posts():
    connection = get_slave_conn()
    current = connection.cursor()
    current.execute("SELECT id, title, content FROM posts")
    posts = current.fetchall()
    current.close()
    connection.close()

    return [{"id": p[0], "title": p[1], "content": p[2]} for p in posts]

#Update operation
@app.put("/update-posts/{post_id}")
async def update_post(post_id: int, request: Request):
    data = await request.json()
    title = data.get("title")
    content = data.get("content")

    connection = get_master_conn()
    current = connection.cursor()
    current.execute("UPDATE posts SET title = %s, content = %s WHERE id = %s", (title, content, post_id,))
    connection.commit()
    current.close()
    connection.close()

    return {"message": "Post updated"}

#Delete Operation
@app.delete("/delete-posts/{post_id}")
async def delete_post(post_id: int):
    connection = get_master_conn()
    current = connection.cursor()
    current.execute("DELETE FROM posts WHERE id = %s", (post_id,))
    connection.commit()
    current.close()
    connection.close()

    return {"message": "Post deleted"}
    
#Read Operation by id
@app.get("/read-posts/{post_id}")
async def get_post_by_id(post_id: int):
    connection = get_slave_conn()
    current = connection.cursor()
    current.execute("SELECT id, title, content FROM posts WHERE id = %s", (post_id,))
    post = current.fetchone()
    current.close()
    connection.close()

    if post:
        return {"id": post[0], "title": post[1], "content": post[2]}
    else:
        return {"error": "Post not found"}
