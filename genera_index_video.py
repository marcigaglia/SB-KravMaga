#!/usr/bin/env python3
"""
Esegui questo script ogni volta che aggiungi video alla cartella video/.
Aggiorna automaticamente video/index.json con i file .mp4 presenti.

Nomenclatura file: {cintura}_{sezione}_{tecnica}.mp4
  es. arancio_1_3.mp4 = cintura arancione, sezione 1 (Cadute), tecnica 3

Uso:
  python3 genera_index_video.py
"""
import os, json

video_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'video')
if not os.path.exists(video_dir):
    os.makedirs(video_dir)

files = sorted([
    f for f in os.listdir(video_dir)
    if f.lower().endswith('.mp4')
])

out_path = os.path.join(video_dir, 'index.json')
with open(out_path, 'w') as f:
    json.dump(files, f, indent=2)

print(f"Aggiornato video/index.json: {len(files)} video trovati")
for f in files:
    belt, sec, tech = f.replace('.mp4','').split('_')
    print(f"  {f}  (cintura {belt}, sezione {sec}, tecnica {tech})")
