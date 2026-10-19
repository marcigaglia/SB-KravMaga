# SB-KravMaga

Web app (PWA) con i programmi tecnici Krav Maga — Street Self Defence Method.
Pubblicata con GitHub Pages: https://marcigaglia.github.io/SB-KravMaga/

---

## Struttura del progetto

```
SB-KravMaga/
├── index.html               Pagina principale (dati delle tecniche + logica)
├── sw.js                    Service worker (cache e uso offline)
├── manifest.json            Manifest PWA
├── icon-192.png, icon-512.png
├── genera_index_video.py    Script che aggiorna video/index.json
├── index_auth0.html         ARCHIVIO della vecchia versione con login: non usare
├── README.md                Questa guida
└── video/
    ├── index.json           Elenco dei video presenti (generato dallo script)
    └── *.mp4                I video delle tecniche
```

---

# Guida: aggiungere un video a una tecnica

## Come funziona (in breve)

1. Ogni tecnica in `index.html` ha un campo `video:'nomefile.mp4'`.
2. Il file `.mp4` sta nella cartella `video/`.
3. Il file `video/index.json` elenca i video **realmente presenti**.
4. Il sito mostra l'icona `▶` e il player **solo** se il nome del video compare in `index.json`.

Se manca anche uno solo di questi passaggi, il video non compare.

---

## 1. Nome del file

Formato:

```
{cintura}_{sezione}_{tecnica}.mp4
```

| Parte     | Significato                                              |
|-----------|----------------------------------------------------------|
| cintura   | nome della cintura in minuscolo (es. `verde`, `marrone`) |
| sezione   | numero della sezione, contando dall'alto (1, 2, 3…)      |
| tecnica   | numero della tecnica all'interno della sezione           |

Esempi:

- `marrone_1_1.mp4` → cintura marrone, sezione 1 (Difesa da pistola), tecnica 1
- `verde_5_3.mp4` → cintura verde, sezione 5, tecnica 3

### Regole importanti

- Tutto **minuscolo**, senza spazi, senza accenti.
- Esattamente **due underscore** (`_`): con un numero diverso lo script
  `genera_index_video.py` va in errore.
- Estensione `.mp4` minuscola.
- Su GitHub Pages maiuscole e minuscole contano: `Marrone_1_1.mp4` ≠ `marrone_1_1.mp4`.

---

## 2. Formato del video

Per essere riprodotto da tutti i browser (iPhone compreso):

- Contenitore: **MP4**
- Video: **H.264**
- Audio: **AAC**
- Risoluzione consigliata: 480p–576p (i video attuali sono 848×480 o 1024×576)
- Peso consigliato: sotto i 20 MB

Per convertire o comprimere un video (serve [ffmpeg](https://ffmpeg.org)):

```bash
ffmpeg -i originale.mov -c:v libx264 -profile:v baseline -pix_fmt yuv420p \
  -vf "scale=-2:480" -c:a aac -movflags +faststart marrone_1_2.mp4
```

`-movflags +faststart` fa partire il video subito, senza aspettare il download completo.

### Limiti di GitHub

- Caricamento dal browser (drag & drop): massimo **25 MB** per file.
- Caricamento con `git push`: massimo **100 MB** per file.

---

## 3. Collegare il video alla tecnica in `index.html`

Cerca la tecnica e controlla che il campo `video` abbia **lo stesso nome** del file:

```js
{ n:'2', name:'Frontale al petto', video:'marrone_1_2.mp4', desc:'...' },
```

- Se `video:''` è vuoto, aggiungi il nome del file.
- Più tecniche possono usare lo stesso video (basta scrivere lo stesso nome).

---

## 4. Aggiornare `video/index.json`

Dalla cartella principale del progetto esegui:

```bash
python3 genera_index_video.py
```

Lo script legge tutti gli `.mp4` presenti in `video/` e riscrive `video/index.json`.
Alla fine stampa l'elenco dei video trovati: controlla che ci sia anche il nuovo.

> Non modificare `index.json` a mano, a meno che tu non sappia cosa fai:
> basta una virgola sbagliata per far sparire tutti i video.

---

## 5. Pubblicare su GitHub

Con git:

```bash
git add video/ index.html
git commit -m "Aggiunto video marrone_1_2"
git push
```

Oppure dal sito GitHub: **Add file → Upload files**, trascinando:

- il nuovo `.mp4` dentro la cartella `video/`
- il `video/index.json` aggiornato
- `index.html`, se l'hai modificato

Poi premi **Commit changes**.

---

## 6. Verifica

1. Attendi circa un minuto che GitHub Pages ripubblichi.
2. Apri `https://marcigaglia.github.io/SB-KravMaga/video/index.json`
   e controlla che contenga il nome del nuovo file.
3. Apri il sito, entra nella cintura e nella sezione: accanto al titolo
   deve comparire `▶ N` e sulla tecnica il badge `▶ VIDEO`.
4. Apri la tecnica e premi play.

Il sito rilegge `index.json` a ogni apertura, quindi di norma non serve svuotare la cache.

---

## Se il video non compare

| Sintomo | Causa probabile | Cosa fare |
|---------|-----------------|-----------|
| Nessuna icona `▶` | Il nome non è in `video/index.json` | Rilancia lo script e ricarica `index.json` su GitHub |
| `index.json` online non contiene il file | Non è stato fatto commit/push di `index.json` | Caricalo su GitHub |
| Icona presente ma il video non parte | Codec non supportato (es. HEVC/H.265 da iPhone) | Riconverti con il comando ffmpeg qui sopra |
| Errore 404 sul video | Nome diverso (maiuscole, spazi) o file nella cartella sbagliata | Controlla che sia in `video/` con il nome esatto |
| Icona presente ma tecnica senza video | Il campo `video:` in `index.html` è vuoto o ha un nome diverso | Correggi `index.html` |
| Vedi ancora la versione vecchia | Cache del service worker | DevTools → Application → Service Workers → Unregister, poi Clear site data e Ctrl+Shift+R |
| Overlay di login Auth0 | Online c'è una vecchia versione di `index.html` | Sovrascrivi `index.html` e `sw.js` con quelli aggiornati |

---

## Checklist rapida

- [ ] Video convertito in MP4 (H.264 + AAC)
- [ ] Nome file corretto: `cintura_sezione_tecnica.mp4`, minuscolo
- [ ] File copiato in `video/`
- [ ] Campo `video:` corretto in `index.html`
- [ ] Eseguito `python3 genera_index_video.py`
- [ ] Commit e push di video, `index.json` e (se modificato) `index.html`
- [ ] Controllato `video/index.json` online
- [ ] Provato il video sul sito

---

## Note tecniche

- `index_auth0.html` è solo un archivio della vecchia versione con login: non va usato né caricato come pagina principale.
- `sw.js` (cache `kravmaga-v2`) carica pagina e `video/index.json` prima dalla rete e usa la cache solo offline. Non intercetta i file `.mp4`, che sono gestiti direttamente dal browser.
- Se modifichi `sw.js` in modo da cambiare cosa va in cache, incrementa il nome della cache (`kravmaga-v3`, …) così i browser eliminano la vecchia.
- `index.html` scarica `video/index.json` con `cache: 'no-store'` e un parametro `?t=` per evitare versioni vecchie.
