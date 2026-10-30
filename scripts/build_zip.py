#!/usr/bin/env python3
import os
import zipfile

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
OUTPUT_ZIP = os.path.join(PROJECT_ROOT, "public", "monogram-studio-source.zip")
ROOT_ZIP = os.path.join(PROJECT_ROOT, "monogram-studio-source.zip")

EXCLUDE_DIRS = {
    "node_modules",
    ".git",
    "dist",
    ".cache",
    ".vite",
    ".bun",
    "__pycache__"
}

EXCLUDE_EXTS = {
    ".zip",
    ".log",
    ".swp"
}

def create_zip(target_zip_path):
    os.makedirs(os.path.dirname(target_zip_path), exist_ok=True)
    file_count = 0
    with zipfile.ZipFile(target_zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(PROJECT_ROOT):
            # Prune excluded directories (keep .github, exclude .git)
            dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS and d != '.git']
            
            for file in sorted(files):
                if file.startswith('.DS_Store'):
                    continue
                _, ext = os.path.splitext(file)
                if ext.lower() in EXCLUDE_EXTS:
                    continue
                
                full_path = os.path.join(root, file)
                # Don't include the target zip file if writing to public
                if os.path.abspath(full_path) == os.path.abspath(target_zip_path):
                    continue
                if os.path.abspath(full_path) == os.path.abspath(OUTPUT_ZIP):
                    continue
                if os.path.abspath(full_path) == os.path.abspath(ROOT_ZIP):
                    continue

                rel_path = os.path.relpath(full_path, PROJECT_ROOT)
                zipf.write(full_path, rel_path)
                file_count += 1
                
    file_size_kb = os.path.getsize(target_zip_path) / 1024
    print(f"Created archive {target_zip_path}: {file_count} files, {file_size_kb:.1f} KB")

if __name__ == "__main__":
    create_zip(OUTPUT_ZIP)
    create_zip(ROOT_ZIP)
