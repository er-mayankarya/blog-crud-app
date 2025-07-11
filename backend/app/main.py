from fastapi import FastAPI, Request
from app.db import get_master_conn, get_slave_conn

app = FastAPI()

@app.get("/")
def home():
    return "Welcome to the Project"

#Create Operation
@app.post("/posts")
async def create_post(request: Request):
    data = await request.json()
    title = data.get("title")
    content = data.get("content")

    conn = get_master_conn()
    cur = conn.cursor()
    cur.execute("INSERT INTO posts (title, content) VALUES (%s, %s)", (title, content))
    conn.commit()
    cur.close()
    conn.close()

    return {"message": "Post created"}

#Read Operation
@app.get("/posts")
async def list_posts():
    conn = get_slave_conn()
    cur = conn.cursor()
    cur.execute("SELECT id, title, content FROM posts")
    posts = cur.fetchall()
    cur.close()
    conn.close()

    return [{"id": p[0], "title": p[1], "content": p[2]} for p in posts]

#Update operation
@app.put("/posts/{post_id}")
async def update_post(post_id: int, request: Request):
    data = await request.json()
    title = data.get("title")
    content = data.get("content")

    conn = get_master_conn()
    cur = conn.cursor()
    cur.execute("UPDATE posts SET title = %s, content = %s WHERE id = %s", (title, content, post_id,))
    conn.commit()
    cur.close()
    conn.close()

    return {"message": "Post updated"}

#Delete Operation
@app.delete("/posts/{post_id}")
async def delete_post(post_id: int):
    conn = get_master_conn()
    cur = conn.cursor()
    cur.execute("DELETE FROM posts WHERE id = %s", (post_id,))
    conn.commit()
    cur.close()
    conn.close()

    return {"message": "Post deleted"}
    
# Read Operation by id
@app.get("/posts/{post_id}")
async def get_post_by_id(post_id: int):
    conn = get_slave_conn()
    cur = conn.cursor()
    cur.execute("SELECT id, title, content FROM posts WHERE id = %s", (post_id,))
    post = cur.fetchone()
    cur.close()
    conn.close()

    if post:
        return {"id": post[0], "title": post[1], "content": post[2]}
    else:
        return {"error": "Post not found"}
