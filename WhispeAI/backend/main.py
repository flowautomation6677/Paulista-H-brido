from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import whisper
import os
import shutil
import tempfile
import imageio_ffmpeg

import sys
import imageio_ffmpeg
import logging

# Configure Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Ensure ffmpeg is available as 'ffmpeg.exe' in the path
# Ensure ffmpeg is available in the path
ffmpeg_src = imageio_ffmpeg.get_ffmpeg_exe()
ffmpeg_filename = "ffmpeg.exe" if sys.platform == "win32" else "ffmpeg"
ffmpeg_dest = os.path.join(os.path.dirname(sys.executable), ffmpeg_filename)

if not os.path.exists(ffmpeg_dest):
    logger.info(f"Copying ffmpeg to {ffmpeg_dest}...")
    # Add permission handling for Unix/Mac
    shutil.copy(ffmpeg_src, ffmpeg_dest)
    if sys.platform != "win32":
        # Make the copied file executable on Unix-like systems
        st = os.stat(ffmpeg_dest)
        os.chmod(ffmpeg_dest, st.st_mode | 0o111)

# CRITICAL: Add the directory of the python executable (venv/Scripts) to PATH
# This ensures that subprocess calls (like those from whisper) can find ffmpeg.exe
sys_path = os.path.dirname(sys.executable)
if sys_path not in os.environ["PATH"]:
    logger.info(f"Adding {sys_path} to PATH")
    os.environ["PATH"] += os.pathsep + sys_path

# Verify ffmpeg availability
ffmpeg_path = shutil.which("ffmpeg")
logger.info(f"FFMPEG found at: {ffmpeg_path}")
if not ffmpeg_path:
    logger.error("FFMPEG NOT FOUND IN PATH! Transcriptions will fail.")

from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import webbrowser
import threading

# ... (existing imports)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model globally (or lazily)
# "base" is a good balance. "large" provides best accuracy but is slower.
MODEL_TYPE = "large"
model = None

def get_model():
    global model
    if model is None:
        print(f"Loading Whisper model: {MODEL_TYPE}...")
        model = whisper.load_model(MODEL_TYPE)
        print("Model loaded.")
    return model

# Mount the frontend 'dist' directory
# In development, this might not exist yet, or be in a different place relative to main.py
# When frozen (exe), sys._MEIPASS might be used if we bundle it there, 
# but for now we assume it's in ../frontend/dist relative to this file or packaged alongside.

# Determine path to "dist"
if getattr(sys, 'frozen', False):
    # Running as compiled exe
    # We will configure PyInstaller to put "dist" inside the internal dir
    dist_dir = os.path.join(sys._MEIPASS, "frontend", "dist")
else:
    # Running as script
    dist_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend", "dist")

if os.path.exists(dist_dir):
    app.mount("/assets", StaticFiles(directory=os.path.join(dist_dir, "assets")), name="assets")
else:
    logger.warning(f"Frontend dist directory not found at {dist_dir}")

@app.get("/")
def read_root():
    if os.path.exists(os.path.join(dist_dir, "index.html")):
        return FileResponse(os.path.join(dist_dir, "index.html"))
    return {"message": "Whisper API is running (Frontend not found)"}

def open_browser():
    webbrowser.open("http://127.0.0.1:8000")

@app.on_event("startup")
async def startup_event():
    # Timer to avoid blocking startup
    threading.Timer(1.5, open_browser).start()

@app.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    # Validate file type
    allowed_extensions = {"wav", "mp3", "m4a", "mp4", "avi", "mkv", "mov", "flv", "webm"}
    file_ext = file.filename.split(".")[-1].lower()
    
    if file_ext not in allowed_extensions:
        raise HTTPException(status_code=400, detail=f"Invalid file type. Allowed: {allowed_extensions}")

    # Save temp file
    with tempfile.NamedTemporaryFile(delete=False, suffix=f".{file_ext}") as tmp:
        shutil.copyfileobj(file.file, tmp)
        tmp_path = tmp.name

    try:
        # Load model and transcribe
        whisper_model = get_model()
        result = whisper_model.transcribe(tmp_path)
        
        return {
            "filename": file.filename,
            "text": result["text"],
            "language": result.get("language", "unknown")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Cleanup
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

if __name__ == "__main__":
    import uvicorn
    
    # Fix for PyInstaller noconsole mode: stdout/stderr are None
    if sys.stdout is None:
        sys.stdout = open(os.devnull, "w")
    if sys.stderr is None:
        sys.stderr = open(os.devnull, "w")
        
    # Disable coloring to avoid further isatty checks
    uvicorn.run(app, host="0.0.0.0", port=8000, log_config=None)
