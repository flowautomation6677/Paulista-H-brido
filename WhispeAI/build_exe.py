import PyInstaller.__main__
import shutil
import os
import sys

import imageio_ffmpeg

# Define paths
base_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.join(base_dir, "backend")
frontend_dist = os.path.join(base_dir, "frontend", "dist")

# Ensure frontend build exists
if not os.path.exists(frontend_dist):
    print("Error: Frontend build not found! Run 'npm run build' in frontend/ directory first.")
    sys.exit(1)

print("Starting build process...")

# Determine platform specific separator
add_data_sep = ";" if sys.platform == "win32" else ":"

PyInstaller.__main__.run([
    os.path.join(backend_dir, "main.py"),
    '--name=WhisperAI',
    '--noconfirm', # Force overwrite output directory
    '--onedir',  # Folder based is safer for heavy ML apps
    '--noconsole',  # Hide console window (remove if debugging needed)
    f'--add-data={frontend_dist}{add_data_sep}frontend/dist',
    '--hidden-import=uvicorn',
    '--hidden-import=uvicorn.logging',
    '--hidden-import=uvicorn.loops',
    '--hidden-import=uvicorn.loops.auto',
    '--hidden-import=uvicorn.protocols',
    '--hidden-import=uvicorn.protocols.http',
    '--hidden-import=uvicorn.protocols.http.auto',
    '--hidden-import=uvicorn.lifespan',
    '--hidden-import=uvicorn.lifespan.on',
    '--hidden-import=whisper',
    '--hidden-import=torch',
    '--hidden-import=numpy',
    '--collect-all=whisper',  # Collect all whisper data/submodules
    '--clean',
    '--distpath=dist',
    '--workpath=build',
    '--specpath=.'
])

print("PyInstaller build complete.")

# Post-build steps: Copy FFMPEG
dist_folder = os.path.join(base_dir, "dist", "WhisperAI")

# Dynamically find ffmpeg using the library, same as backend
ffmpeg_src = imageio_ffmpeg.get_ffmpeg_exe()
ffmpeg_filename = "ffmpeg.exe" if sys.platform == "win32" else "ffmpeg"
ffmpeg_dest = os.path.join(dist_folder, ffmpeg_filename)

if os.path.exists(ffmpeg_src):
    print(f"Copying ffmpeg from {ffmpeg_src} to {ffmpeg_dest}")
    shutil.copy(ffmpeg_src, ffmpeg_dest)
    if sys.platform != "win32":
        # Make executable on unix
        st = os.stat(ffmpeg_dest)
        os.chmod(ffmpeg_dest, st.st_mode | 0o111)
else:
    print(f"WARNING: ffmpeg not found at {ffmpeg_src}. You may need to copy it manually.")

print(f"Build finished! Executable is in: {dist_folder}")
