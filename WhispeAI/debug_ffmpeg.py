import os
import subprocess
import imageio_ffmpeg
import sys

print("Current PATH before update:")
# print(os.environ["PATH"]) # Too verbose

ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
print(f"ImageIO FFMPEG exe: {ffmpeg_exe}")

ffmpeg_dir = os.path.dirname(ffmpeg_exe)
print(f"Directory to add: {ffmpeg_dir}")

os.environ["PATH"] += os.pathsep + ffmpeg_dir

print("Attempting to run ffmpeg via subprocess...")
try:
    subprocess.run(["ffmpeg", "-version"], check=True, capture_output=True)
    print("SUCCESS: ffmpeg found and ran.")
except FileNotFoundError:
    print("FAILURE: ffmpeg not found (FileNotFoundError).")
except Exception as e:
    print(f"FAILURE: Other error: {e}")

print("\nAttempting to import whisper and check something...")
try:
    import whisper
    print("Whisper imported.")
    # Maybe try a tiny transcribe if possible? checking runtime dependency
    print("Not running full transcribe yet, just checking import and path visibility.")
except ImportError as e:
    print(f"Whisper import failed: {e}")
