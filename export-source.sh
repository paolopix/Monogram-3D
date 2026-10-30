#!/usr/bin/env bash
# Script per esportare tutti i file sorgente del progetto in un archivio ZIP pulito
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

echo "=== Esportazione sorgenti MonogramStudio 3D ==="
python3 scripts/build_zip.py

echo ""
echo "Archivio creato con successo in:"
echo " - public/monogram-studio-source.zip (per download via browser)"
echo " - monogram-studio-source.zip (nella root del progetto)"
echo "Puoi scaricarlo direttamente o estrarlo con: unzip monogram-studio-source.zip"
