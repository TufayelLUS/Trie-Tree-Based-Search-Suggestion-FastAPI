from fastapi import FastAPI, Request
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
import uvicorn
import marisa_trie
import os

app = FastAPI()

# Serve the "static" directory
app.mount("/static", StaticFiles(directory="static"), name="static")

# Load the words for suggestions
words = open("words.txt", "r").read().splitlines()
trie = marisa_trie.Trie(words)

# Get the absolute path of index.html (assuming it's inside the "static" folder)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
INDEX_HTML_PATH = os.path.join(BASE_DIR, "static", "index.html")


@app.get("/", response_class=FileResponse)
async def root():
    return FileResponse(INDEX_HTML_PATH)


@app.post("/suggestions", response_class=JSONResponse)
async def get_suggestions(request: Request):
    data = await request.json()
    keyword = data.get("keyword", "")
    suggestions = trie.keys(keyword)
    return {"suggestions": suggestions}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
