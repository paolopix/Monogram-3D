# MonogramStudio 3D - Generatore Monogrammi & Nomi

Applicazione React + Vite + TypeScript + Tailwind CSS per la generazione, anteprima e confronto di monogrammi 3D multilivello (lettera/e maiuscole di sfondo e nome in corsivo davanti con 8 font contemporanei).

## 🚀 Funzionalità Principali

1. **Lettere Maiuscole di Sfondo**:
   - Inserimento di 1 o 2 lettere / numeri.
   - Regolazione personalizzata della spaziatura orizzontale (tracking/letter spacing) quando sono presenti 2 caratteri.
   - Selezione del font per le lettere grandi (applicato a tutti gli 8 campioni).
   - Colori o finiture materiche (Legno Rovere, Noce, Oro Spazzolato, Acrilico Bianco/Nero, Argento, Rame, Marmo Carrara, ecc.).
   - Ombre e smussature tridimensionali realistiche.

2. **Nomi in Rilievo Sovrapposti**:
   - Inserimento del nome intero (es. "Anna", "Marco", "Sofia").
   - 8 font corsivi/script differenti mostrati simultaneamente a confronto (ESEMPIO 1, ESEMPIO 2, ..., ESEMPIO 8).
   - Spostamento orizzontale e verticale individuale per ciascun esempio tramite drag & drop o slider numerici.
   - **Ridimensionamento rapido tramite rotella del mouse (scroll wheel)** direttamente durante il trascinamento o hovering sul nome.
   - Personalizzazione colore e finitura materiale del nome.

3. **Gestione Font Personalizzati**:
   - Caricamento di font propri (.ttf, .otf, .woff, .woff2).
   - Possibilità di importare font da Google Fonts tramite link/nome.
   - I font personalizzati possono essere assegnati sia alla lettera iniziale di sfondo sia ai singoli esempi dei nomi.

4. **Salvataggio & Gestione Progetti**:
   - Salvataggio rapido in memoria locale (`localStorage`).
   - Esportazione del progetto in formato file `.json`.
   - Ripristino di progetti precedentemente salvati per apportare modifiche in qualsiasi momento.

5. **Esportazione ad Alta Definizione**:
   - Esportazione in PNG ad alta risoluzione (1x, 2x Retina, 3x Ultra HD 300 DPI), JPEG e SVG vettoriale.
   - Opzione per esportare la tavola completa con tutti gli 8 esempi oppure un singolo esempio isolato.
   - Opzione per includere o escludere i badge "ESEMPIO 1..8".
   - Pulizia automatica: durante l'esportazione le maniglie di selezione, i contorni di focus e i pulsanti operativi vengono rimossi per garantire un'immagine pulita e pronta per la stampa o l'incisione laser.
   - Copia istantanea dell'immagine negli appunti di sistema.

---

## 🛠️ Come Avviare il Progetto in Locale

### Prerequisiti
- **Node.js** (versione 18 o successiva)
- **npm**, **pnpm**, o **yarn**

### Installazione
1. Estrai l'archivio ZIP:
   ```bash
   unzip monogram-studio-source.zip -d monogram-studio
   cd monogram-studio
   ```

2. Installa le dipendenze:
   ```bash
   npm install
   ```

3. Avvia il server di sviluppo:
   ```bash
   npm run dev
   ```

4. Apri il browser all'indirizzo indicato dal terminale (tipicamente `http://localhost:3000` o `http://localhost:5173`).

### Script Utili
- `npm run dev`: Avvia il dev server Vite.
- `npm run build`: Compila l'applicazione per la produzione nella cartella `dist`.
- `npm run preview`: Visualizza in locale l'anteprima della build di produzione.
- `./export-source.sh`: Rigenera l'archivio ZIP con tutti i file sorgente aggiornati.


---

## Pubblicazione gratuita su GitHub Pages

Il progetto è predisposto per essere pubblicato all'indirizzo:

https://paolopix.github.io/Monogram-3D/

1. Carica questi file nel repository GitHub `paolopix/Monogram-3D`, mantenendo la cartella `.github/workflows`.
2. Su GitHub apri **Settings → Pages**.
3. In **Build and deployment → Source** seleziona **GitHub Actions**.
4. Vai nella scheda **Actions** e attendi il completamento del workflow
   “Pubblica MonogramStudio 3D su GitHub Pages”.
5. Al termine, apri https://paolopix.github.io/Monogram-3D/.

Dopo la prima pubblicazione, ogni aggiornamento inviato al branch `main` avvierà
automaticamente una nuova compilazione e pubblicazione.

Nota: i progetti e i font personalizzati sono salvati nel browser del singolo
utente. Non vengono sincronizzati automaticamente tra computer o browser diversi.
