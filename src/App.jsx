import React, { useMemo, useState, useCallback } from "react";

/* ─────────────────────────────────────────────
   SISTEMA DI ICONE SVG INLINE (senza lucide-react)
   viewBox 24x24, tratto lineare, spessore 2px
   ───────────────────────────────────────────── */
const ICON_PATHS = {
  bookOpen: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z",
  brain: "M9.5 2a3.5 3.5 0 0 0-3 5.1A3.5 3.5 0 0 0 5 10.5 3.5 3.5 0 0 0 6 14a3.5 3.5 0 0 0 2.8 4A3.5 3.5 0 0 0 12 21a3.5 3.5 0 0 0 3.2-3 3.5 3.5 0 0 0 2.8-4 3.5 3.5 0 0 0 1-3.5 3.5 3.5 0 0 0-1.5-3.4A3.5 3.5 0 0 0 14.5 2 3.5 3.5 0 0 0 12 3.5 3.5 3.5 0 0 0 9.5 2zM12 3.5v17.5",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35",
  globe: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z",
  folderOpen: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2zM2 10h20",
  settings: "M12 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM12 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM12 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2z",
  settingsGear: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  bot: "M12 8V4H8M8 2h8M2 14a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zM9 16h.01M15 16h.01",
  penTool: "M12 19l7-7 3 3-7 7zM18 13l-1.5-7.5L2 2l3.5 14.5L13 18z M2 2l7.586 7.586M11 13a2 2 0 1 1 0-4 2 2 0 0 1 0 4z",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  checkCircle: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM9 12l2 2 4-4",
  sparkles: "M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5zM19 14l.75 2.25L22 17l-2.25.75L19 20l-.75-2.25L16 17l2.25-.75z",
  mic: "M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v3M8 22h8",
  imagePlus: "M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7M16 5h6M19 2v6M21 15l-5-5L5 21",
  fileText: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8",
  clock: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2",
  panelsTopLeft: "M3 3h18a0 0 0 0 1 0 0v18a0 0 0 0 1 0 0H3a0 0 0 0 1 0 0V3zM3 9h18M9 21V9",
  workflow: "M3 3h4v4H3zM17 3h4v4h-4zM10 17h4v4h-4zM5 7v3a4 4 0 0 0 4 4h2M19 7v3a4 4 0 0 1-4 4h-2",
  laptop: "M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9M2 20h20M12 16v4",
  wrench: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",
  compass: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36z",
  arrowRight: "M5 12h14M12 5l7 7-7 7",
  refreshCcw: "M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 0 1 3.51 15",
  link2: "M9 17H7a5 5 0 0 1 0-10h2M15 7h2a5 5 0 0 1 0 10h-2M8 12h8",
  users: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  headphones: "M3 18v-6a9 9 0 0 1 18 0v6M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z",
  table2: "M3 3h18v18H3zM3 9h18M3 15h18M9 3v18M15 3v18",
  camera: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  layoutGrid: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
  school: "M22 10v6M2 10l10-5 10 5-10 5zM6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5",
  share2: "M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98",
  lightbulb: "M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z",
  chevronDown: "M6 9l6 6 6-6",
  alertTriangle: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  layers: "M12 2l10 6.5v7L12 22 2 15.5v-7zM2 8.5l10 6.5 10-6.5M12 22V15",
  messageSquare: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  database: "M12 8c4.97 0 9-1.34 9-3s-4.03-3-9-3-9 1.34-9 3 4.03 3 9 3zM21 12c0 1.66-4.03 3-9 3s-9-1.34-9-3M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5",
};

function Ico({ name, className = "", style = {} }) {
  const d = ICON_PATHS[name];
  if (!d) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      <path d={d} />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   FONT + STILI GLOBALI
   ───────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,700;1,9..144,400&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap');
    .ff-display { font-family: 'Fraunces', Georgia, serif; }
    .ff-body { font-family: 'DM Sans', system-ui, sans-serif; }
    .ff-mono { font-family: 'JetBrains Mono', monospace; }
    * { font-family: 'DM Sans', system-ui, sans-serif; }
    .clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  `}</style>
);

/* ─────────────────────────────────────────────
   COLORI
   ───────────────────────────────────────────── */
const C = {
  cream: "#FAF8F4", creamDark: "#F0EDE6", ink: "#1A1A1A", inkLight: "#6B6B6B",
  inkMuted: "#9B9B9B", border: "#E2DFD8", borderLight: "#ECEAE4",
  greenDeep: "#0A3D2E", greenMid: "#10a37f", greenLight: "#E8F5EE", roseAccent: "#E11D48",
};

/* ─────────────────────────────────────────────
   DATI
   ───────────────────────────────────────────── */
const VERIFIED_DATE = "12 marzo 2026";
const LEVELS = [
  { key: "all", label: "Tutti" }, { key: "foundation", label: "Base" },
  { key: "core", label: "Essenziale" }, { key: "power", label: "Avanzato" }, { key: "expert", label: "Esperto" },
];

const CORE_FEATURES = [
  { title: "Ricerca", ico: "globe", color: "#0284c7", description: "Risultati web in tempo reale per fatti attuali, prezzi, notizie, leggi e tutto ciò che cambia.", when: "Per tutto ciò che potrebbe essere cambiato dopo il cutoff di addestramento del modello." },
  { title: "Ricerca approfondita", ico: "search", color: "#4f46e5", description: "Ricerca documentata in più passaggi tra fonti web, file e app collegate.", when: "Quando ti serve un report con fonti, non una risposta veloce." },
  { title: "Progetti", ico: "folderOpen", color: "#059669", description: "Spazio di lavoro persistente con file condivisi, istruzioni personalizzate e memoria delle conversazioni.", when: "Per qualsiasi lavoro a cui tornerai: corsi, clienti, startup." },
  { title: "Memoria", ico: "database", color: "#d97706", description: "Conserva preferenze stabili e contesto ricorrente tra conversazioni diverse.", when: "Per preferenze e abitudini, non per archiviare documenti completi." },
  { title: "Istruzioni personalizzate", ico: "settingsGear", color: "#57534e", description: "Regole sempre attive per tono, formattazione e struttura delle risposte.", when: "Se vuoi che ogni chat segua le tue regole per impostazione predefinita." },
  { title: "Canvas", ico: "panelsTopLeft", color: "#334155", description: "Superficie di lavoro visibile per scrittura e codice, con modifiche mirate direttamente nel testo.", when: "Per la revisione iterativa di testi lunghi o codice." },
  { title: "Attività", ico: "clock", color: "#7c3aed", description: "Programma output che verranno eseguiti in seguito e ti invieranno una notifica.", when: "Promemoria, briefing quotidiani, riepiloghi ricorrenti." },
  { title: "App (connettori)", ico: "wrench", color: "#0d9488", description: "Collega strumenti esterni così ChatGPT può leggere i tuoi dati e agire su di essi.", when: "Quando il contesto migliore si trova fuori dalla chat." },
  { title: "Agent", ico: "workflow", color: "#16a34a", description: "Esecuzione autonoma tra browser, file, codice e app collegate.", when: "Per attività a più passaggi tra siti e azioni diverse." },
  { title: "GPT personalizzati", ico: "bot", color: "#44403c", description: "Assistenti riutilizzabili con istruzioni stabili e file di conoscenza.", when: "Quando un flusso di lavoro si ripete abbastanza da meritare una struttura fissa." },
  { title: "Voce", ico: "mic", color: "#e11d48", description: "Interazione vocale per ragionare ed esplorare con meno attrito.", when: "Quando vuoi pensare ad alta voce o fare più cose insieme." },
  { title: "Immagini", ico: "imagePlus", color: "#c026d3", description: "Carica immagini per analizzarle, generane da descrizioni e modificale direttamente.", when: "Per comprendere, creare o rifinire contenuti visivi." },
  { title: "File e dati", ico: "fileText", color: "#0891b2", description: "Carica PDF, fogli di calcolo e documenti per analizzarli anche con esecuzione di codice.", when: "Per grafici, sintesi e calcoli." },
  { title: "Modelli", ico: "brain", color: "#65a30d", description: "Scegli modalità ottimizzate per velocità, equilibrio o ragionamento approfondito.", when: "Per adattare la potenza alla complessità del compito." },
];

const ADDITIONAL_FEATURES = [
  { title: "Modalità studio", ico: "school", color: "#059669", description: "Apprendimento guidato con domande e verifiche di comprensione." },
  { title: "Registra", ico: "headphones", color: "#0284c7", description: "Acquisisci riunioni parlate e trasformale poi in riepiloghi." },
  { title: "Chat di gruppo", ico: "users", color: "#7c3aed", description: "Invita altre persone in una conversazione per pianificare insieme." },
  { title: "Link condivisi", ico: "link2", color: "#57534e", description: "Condividi una conversazione tramite URL." },
  { title: "Modifica immagini", ico: "camera", color: "#c026d3", description: "Seleziona e rifinisci aree specifiche delle immagini generate." },
  { title: "Tabelle interattive", ico: "table2", color: "#0891b2", description: "Esamina visivamente i dati caricati prima dell'analisi." },
  { title: "Skill", ico: "share2", color: "#0d9488", description: "Flussi di lavoro riutilizzabili per compiti ripetuti in modo coerente." },
  { title: "Pulse", ico: "sparkles", color: "#4f46e5", description: "Ricerca asincrona che restituisce riepiloghi visivi." },
];

const TOOL_CHOOSER = [
  { goal: "Risposta veloce o bozza", tool: "Chat normale", ico: "messageSquare", reason: "È l'opzione con meno attrito." },
  { goal: "Informazioni aggiornate", tool: "Ricerca", ico: "globe", reason: "Per tutto ciò che potrebbe essere cambiato." },
  { goal: "Lavoro continuo con file", tool: "Progetto", ico: "folderOpen", reason: "Conserva il contesto tra sessioni diverse." },
  { goal: "Modificare un documento lungo", tool: "Canvas", ico: "panelsTopLeft", reason: "È migliore per revisioni mirate." },
  { goal: "Report da più fonti", tool: "Ricerca approfondita", ico: "search", reason: "Sintesi in più passaggi con citazioni." },
  { goal: "Attività online complessa", tool: "Agent", ico: "workflow", reason: "Attraversa più siti e più azioni." },
  { goal: "Output ricorrente", tool: "Attività", ico: "clock", reason: "Funziona in modo asincrono e ti avvisa." },
  { goal: "Stesso flusso di lavoro spesso", tool: "GPT o Skill", ico: "bot", reason: "Trasforma schemi ripetuti in sistemi." },
];

const PROMPT_BLOCKS = [
  { label: "Obiettivo", example: "Scrivi un project brief di una pagina per un incontro con investitori.", color: "#10a37f" },
  { label: "Contesto", example: "La startup è pre-revenue, Series A, settore climate tech.", color: "#0284c7" },
  { label: "Vincoli", example: "Massimo 400 parole. Niente gergo. Niente punti elenco.", color: "#7c3aed" },
  { label: "Formato", example: "Struttura: Problema, Soluzione, Traction, Richiesta.", color: "#d97706" },
  { label: "Livello qualitativo", example: "Scrivi a livello di associate McKinsey, non come un modello standard.", color: "#e11d48" },
  { label: "Verifica", example: "Segnala ogni affermazione che richiede una fonte.", color: "#334155" },
];

const GUIDE_SECTIONS = [
  { id:"mental-model", level:"foundation", number:"01", title:"Parti dal giusto modello mentale", ico:"brain", color:"#65a30d",
    summary:"Tratta ChatGPT come un partner di ragionamento, non come un oracolo. La prima risposta è una bozza utile, non una verità finale. Considera ogni output provvisorio finché non lo hai esaminato.",
    whyItMatters:"La maggior parte delle delusioni nasce da aspettative sbagliate. Aspettati una buona prima bozza, non certezza assoluta.",
    beginnerMoves:["Considera la prima risposta come una bozza. Leggila con spirito critico.","Chiedi quali ipotesi sono state fatte.","Usa ChatGPT per accelerare il giudizio, non per sostituirlo."],
    advancedMoves:["Chiedi l'obiezione più forte possibile.","Separa esplorazione, raccomandazione e revisione del rischio in passaggi distinti.","Usalo come secondo parere per decisioni importanti."],
    commonMistakes:["Fidarsi di dati numerici senza verificarli.","Scambiare il silenzio per sicurezza.","Copiare gli output parola per parola."],
    promptExamples:[{prompt:"Quali ipotesi hai fatto?",why:"Fa emergere il ragionamento implicito."},{prompt:"Che cosa contesterebbe un esperto scettico?",why:"Autoverifica in chiave critica."},{prompt:"Qual è l'argomento più forte contro la tua raccomandazione?",why:"Riduce il bias di conferma."},{prompt:"Assegna a ogni affermazione un livello di fiducia da 1 a 5.",why:"Separa i fatti dalla speculazione."}],
    beforeAfter:{before:"Scrivimi un business plan per una caffetteria.",after:"Prepara una bozza di una pagina per una caffetteria specialty nel centro di Boston. Target: studenti magistrali e remote worker. Segnala tutto ciò che è stimato e non supportato da fonti.",improvement:"Aggiunge contesto, pubblico, luogo e una regola di verifica."},
    visual:"mental" },
  { id:"workspace", level:"foundation", number:"02", title:"Impara prima l'ambiente di lavoro, poi i prompt", ico:"laptop", color:"#059669",
    summary:"ChatGPT moderno è uno spazio di lavoro a livelli. Compiti diversi appartengono a livelli diversi. Un prompt discreto nel livello giusto funziona meglio di un prompt brillante nel livello sbagliato.",
    whyItMatters:"Scegliere lo spazio di lavoro corretto è la decisione con il miglior ritorno prima ancora di scrivere una parola.",
    beginnerMoves:["Usa la chat normale per richieste rapide e isolate.","Usa un progetto per tutto ciò a cui tornerai.","Usa la chat temporanea quando vuoi partire da zero."],
    advancedMoves:["Un progetto per ogni corso, cliente o iniziativa.","I progetti come hub di conoscenza a lungo termine.","Canvas per la revisione iterativa; chat per la strategia."],
    commonMistakes:["Aprire sempre nuove chat invece di tornare in un progetto.","Usare la chat per documenti lunghi invece di Canvas.","Ignorare del tutto Attività e Agent."],
    promptExamples:[{prompt:"Per questo lavoro è meglio una chat, un progetto o un GPT?",why:"Il modello sceglie lo spazio più adatto."},{prompt:"Qual è la struttura ideale di un progetto per il mio semestre?",why:"Definisce prima l'architettura."},{prompt:"Quali file e istruzioni dovrei aggiungere?",why:"Ottimizza il contesto del progetto."}],
    beforeAfter:{before:"Continuo ad aprire nuove chat e perdo il contesto.",after:"Crea un Progetto. Carica i riferimenti. Imposta le istruzioni. Torna sempre nello stesso progetto.",improvement:"Le chat effimere diventano uno spazio di lavoro persistente."},
    visual:"layers" },
  { id:"prompting", level:"foundation", number:"03", title:"Prompting: la chiarezza conta più dell'astuzia", ico:"penTool", color:"#0284c7",
    summary:"I buoni prompt sono briefing operativi. Le formule sofisticate sono facoltative; i vincoli chiari no. Il modello non può vedere gli standard che hai in testa se non li metti per iscritto.",
    whyItMatters:"I prompt vaghi producono risultati generici. Quasi tutta la frustrazione nasce da input poco specifici.",
    beginnerMoves:["Indica esplicitamente il pubblico e il caso d'uso.","Definisci che cosa significa avere successo.","Specifica formato, tono, lunghezza e cosa evitare."],
    advancedMoves:["Prima scaletta, poi approvazione, poi bozza completa.","Separa i fatti dall'interpretazione.","Fornisci una rubrica con cui autovalutare l'output."],
    commonMistakes:["Prompt di tre parole aspettandosi un risultato su misura.","Troppi vincoli insieme.","Usare 'puoi...' invece di dare istruzioni dirette."],
    promptExamples:[{prompt:"Obiettivo: ___. Contesto: ___. Vincoli: ___. Produci: ___.",why:"Schema universale."},{prompt:"Prima prepara una scaletta. Non scrivere ancora la bozza.",why:"Evita di dover rifare una struttura sbagliata."},{prompt:"Prima di scrivere, dimmi che cosa ti serve sapere.",why:"Il modello pone domande chiarificatrici."},{prompt:"Scrivi come [ruolo] che spiega a [pubblico].",why:"Definisce tono e profondità."}],
    beforeAfter:{before:"Scrivi una lettera di presentazione.",after:"Lettera di presentazione per Strategy Analyst in McKinsey. Studente magistrale in International Management, esperienza in SOP e CRM. Tono sicuro ma non arrogante. 350 parole. Evita 'I am passionate about'.",improvement:"Ruolo, profilo, tono, lunghezza e vincolo negativo."},
    visual:"prompt" },
  { id:"revision", level:"core", number:"04", title:"I flussi di revisione battono la perfezione al primo colpo", ico:"refreshCcw", color:"#7c3aed",
    summary:"L'uso migliore è iterativo: impostare, produrre una bozza, criticare, rivedere, confezionare. Molti ricominciano da zero quando dovrebbero invece affinare.",
    whyItMatters:"Un solo tentativo blocca la qualità al primo livello. La revisione produce risultati migliori in modo costante.",
    beginnerMoves:["Dopo la bozza: 'Che cosa manca o cosa è debole?'","Rivedi con un obiettivo più preciso.","Non ripartire da zero se la direzione generale è corretta."],
    advancedMoves:["Passaggi fissi: struttura, accuratezza, tono, sintesi, confezionamento.","Autocritica prima della riscrittura.","Specifica il livello di compressione desiderato."],
    commonMistakes:["Riscrivere a mano invece di far diagnosticare il problema al modello.","Feedback vago come 'miglioralo'.","Troppi passaggi senza un obiettivo preciso."],
    promptExamples:[{prompt:"Perché la tua risposta non ha centrato l'obiettivo?",why:"Autodiagnosi prima della revisione."},{prompt:"Rivedi per rendere la logica più netta. Mantieni la struttura.",why:"Limita bene il perimetro."},{prompt:"Comprimi del 35% senza perdere l'essenziale.",why:"Costringe a dare priorità."},{prompt:"Valuta il testo con questi criteri. Dove sei sotto 4/5?",why:"Autovalutazione strutturata."}],
    beforeAfter:{before:"Non va bene. Riprova.",after:"L'argomentazione della sezione 2 è circolare. Riscrivila usando un dato dal report caricato. Mantieni tutto il resto.",improvement:"Dice cosa non va, cosa correggere e cosa preservare."},
    visual:"workflow" },
  { id:"writing", level:"core", number:"05", title:"Scrittura, riscrittura e trasformazione", ico:"fileText", color:"#57534e",
    summary:"ChatGPT eccelle nella trasformazione: riscrivere per pubblici diversi, cambiare tono, sintetizzare, riorganizzare. Spesso è più forte nel migliorare un testo esistente che nel creare da zero.",
    whyItMatters:"La maggior parte della scrittura professionale è trasformazione. Qui l'AI dà il rendimento più alto.",
    beginnerMoves:["Incolla il testo originale. Specifica cosa deve restare e cosa deve cambiare.","Indica pubblico, canale e tono.","Chiedi più versioni se il tono non è ancora chiaro."],
    advancedMoves:["Versioni contrastive: formale, concisa, persuasiva.","Diagnosi frase per frase.","Trasferimento di stile mantenendo i fatti."],
    commonMistakes:["Scrivere da zero quando esistono già note o bozze.","Accettare il primo tono senza alternative.","Non specificare cosa va preservato."],
    promptExamples:[{prompt:"Riscrivi come email a un professore: rispettosa, diretta, senza fronzoli.",why:"Trasformazione precisa."},{prompt:"Tre versioni: formale, concisa, persuasiva.",why:"Scelta tra alternative nette."},{prompt:"Quali frasi suonano generiche e perché?",why:"Diagnosi a livello di singola frase."},{prompt:"Mantieni fatti e struttura. Cambia solo il tono.",why:"Trasformazione ben delimitata."}],
    beforeAfter:{before:"Migliora questa email.",after:"Riscrivi per il direttore del programma. Tono rispettoso e diretto. Elimina il gergo. Massimo 150 parole. Mantieni le azioni richieste.",improvement:"Pubblico, tono, elementi da evitare, lunghezza e parti da mantenere."},
    visual:"writing" },
  { id:"files-data", level:"core", number:"06", title:"File, PDF, fogli di calcolo e dati", ico:"table2", color:"#0891b2",
    summary:"ChatGPT può esaminare file, sintetizzare documenti, eseguire codice sui dati e produrre grafici. La chiave è: prima descrivere, poi analizzare, infine concludere.",
    whyItMatters:"Ispezionare i dati prima di interpretarli evita gli errori più comuni.",
    beginnerMoves:["Chiedi prima che cosa contiene il file, poi che cosa significa.","Richiedi prima un audit dei campi.","Per i PDF: separa struttura, argomento e prove."],
    advancedMoves:["Pretendi una traccia esplicita delle ipotesi.","Fai riformulare le tabelle estratte prima di concludere.","Usa l'esecuzione di codice per dataset grandi."],
    commonMistakes:["Chiedere subito 'gli insight principali'.","Fidarsi delle etichette di un grafico senza verificarle.","Dare per scontato che il parsing dei PDF sia perfetto."],
    promptExamples:[{prompt:"Descrivi: campi, intervallo date, valori mancanti, opzioni di analisi.",why:"Audit prima dell'analisi."},{prompt:"Estrai l'argomento centrale prima di criticarlo.",why:"Comprensione prima del giudizio."},{prompt:"Elenca tutte le ipotesi usate per questo grafico.",why:"Traccia delle assunzioni."},{prompt:"Scrivi Python per pulire questi dati, eseguilo e mostrami il risultato.",why:"Analisi riproducibile."}],
    beforeAfter:{before:"Quali sono gli insight principali di questo foglio di calcolo?",after:"Fai un audit: colonne, tipi, intervallo date, valori mancanti. Proponi tre analisi ordinate per utilità. Non eseguirle finché non approvo.",improvement:"Prima ispezione, poi proposte, poi approvazione."},
    visual:"data" },
  { id:"search-research", level:"core", number:"07", title:"Ricerca, ricerca approfondita e citazioni", ico:"search", color:"#4f46e5",
    summary:"Usa la Ricerca per risposte aggiornate con fonti. Usa la Ricerca approfondita per report in più passaggi. Tutto ciò che è attuale, regolato o in rapida evoluzione non dovrebbe mai basarsi solo sulla memoria statica.",
    whyItMatters:"Senza ricerca, ChatGPT risponde partendo da una fotografia congelata del passato.",
    beginnerMoves:["Usa la ricerca per tutto ciò che potrebbe essere cambiato.","Controlla che le fonti citate supportino davvero le affermazioni specifiche.","Per temi sensibili, preferisci fonti primarie."],
    advancedMoves:["'Separa i fatti confermati dalle tue inferenze.'","Specifica tipi di fonte, area geografica e orizzonte temporale.","Usa la Ricerca approfondita con un perimetro definito."],
    commonMistakes:["Affidarsi alla sola conoscenza del modello per eventi attuali.","Accettare affermazioni 'con fonti' senza aprire i link.","Usare la Ricerca approfondita per domande fattuali semplici."],
    promptExamples:[{prompt:"Cerca. Solo fonti primarie.",why:"Recupero in tempo reale con vincoli di qualità."},{prompt:"Separa fatti e inferenze. Etichetta ogni elemento.",why:"Trasparenza sullo stato epistemico."},{prompt:"Che cosa potrebbe diventare obsoleto entro sei mesi?",why:"Segnala ciò che è sensibile al tempo."},{prompt:"Ricerca approfondita: [tema]. Ambito: [area, date].",why:"Brief chiaro del lavoro da svolgere."}],
    beforeAfter:{before:"Ultime novità sulla regolazione dell'AI?",after:"Cerca: regolazione dell'AI in UE e USA, ultimi 30 giorni. Solo fonti primarie. Separa ciò che è già entrato in vigore da ciò che è ancora proposto.",improvement:"Ambito, finestra temporale, qualità delle fonti e classificazione."},
    visual:"research" },
  { id:"multimodal", level:"core", number:"08", title:"Voce, immagini e flussi multimodali", ico:"imagePlus", color:"#c026d3",
    summary:"Voce, comprensione delle immagini, generazione e modifica sono ormai strumenti standard. La specificità è decisiva: richieste visive vaghe producono risultati generici.",
    whyItMatters:"La multimodalità trasforma ChatGPT in uno strumento di analisi visiva, uno studio creativo e un partner per il brainstorming a mani libere.",
    beginnerMoves:["Spiega esattamente cosa fare con un'immagine caricata.","Usa la voce quando conta più la rapidità della rifinitura.","Per generare immagini: specifica soggetto, inquadratura, atmosfera e stile."],
    advancedMoves:["Concatena le modalità: analizza, spiega, poi crea note.","Usa la critica di immagini per revisioni di design.","Per modifiche: seleziona un'area e descrivi il cambiamento."],
    commonMistakes:["Caricare immagini senza istruzioni.","Aspettarsi fotorealismo da descrizioni vaghe.","Dimenticare che la voce condivide lo stesso contesto del testo."],
    promptExamples:[{prompt:"Estrai le voci del menu e organizzale per categoria.",why:"Estrazione specifica."},{prompt:"Spiega questo grafico a un dirigente non tecnico in 120 parole.",why:"Analisi con vincoli precisi."},{prompt:"Genera: verticale 9:16, cinematografico, golden hour.",why:"Specifiche in stile fotografico."},{prompt:"Sostituisci lo sfondo con uno studio bianco. Mantieni il soggetto.",why:"Modifica delimitata."}],
    beforeAfter:{before:"Fammi un'immagine bella.",after:"16:9: caffetteria moderna a Tokyo al tramonto. Fotografia architettonica, profondità di campo ridotta. Atmosfera calda. Bancone in legno, macchina per espresso, luci della città. Nessuna persona.",improvement:"Rapporto, soggetto, stile, atmosfera, elementi da includere ed esclusioni."},
    visual:"multimodal" },
  { id:"study-collab", level:"power", number:"09", title:"Studio, registrazione, gruppi, link e skill", ico:"layoutGrid", color:"#0d9488",
    summary:"Funzioni utili per imparare, catturare contenuti parlati, collaborare, condividere e formalizzare i flussi di lavoro.",
    whyItMatters:"Studiare è diverso dall'ottenere una risposta. Collaborare è diverso dal fare prompting da soli.",
    beginnerMoves:["Usa la Modalità studio per imparare, non solo per ricevere risposte.","Usa Registra per riunioni e lezioni.","Usa Link condivisi e Chat di gruppo per collaborare in modo ordinato."],
    advancedMoves:["Salva i riepiloghi registrati come file sorgente nei progetti.","Usa le Skill per compiti ripetitivi.","Combina Chat di gruppo e Progetti per condividere il contesto."],
    commonMistakes:["Usare la chat normale per studiare riduce l'apprendimento.","Dimenticare che esiste Registra.","Mandare screenshot invece di condividere un link."],
    promptExamples:[{prompt:"Interrogami invece di darmi subito le risposte.",why:"Approccio didattico."},{prompt:"Trasforma questa registrazione in action item e in una bozza di follow-up.",why:"Trasformazione con più output."},{prompt:"Converti questo flusso di lavoro in una Skill.",why:"Formalizza un processo."}],
    beforeAfter:{before:"Spiegami la fotosintesi.",after:"Sto studiando per un esame di biologia. Non spiegare subito. Fammi domande di verifica, dal livello base a quello avanzato. Correggimi con spiegazioni brevi.",improvement:"Si passa dalla semplice risposta all'apprendimento guidato."},
    visual:"collab" },
  { id:"personalization", level:"power", number:"10", title:"Memoria, istruzioni, personalità, chat temporanea", ico:"database", color:"#d97706",
    summary:"La Memoria conserva il contesto. Le Istruzioni definiscono le regole. La Personalità regola lo stile. La chat temporanea è una stanza pulita. Non sono strumenti intercambiabili.",
    whyItMatters:"Una personalizzazione mal configurata peggiora i risultati più di quanto li migliori.",
    beginnerMoves:["Memoria: preferenze ampie e stabili.","Istruzioni: regole globali di scrittura e risposta.","Chat temporanea: nessun trascinamento di contesto."],
    advancedMoves:["La Personalità aggiunge sfumature, non sostituisce le istruzioni.","Le istruzioni di progetto sono più importanti delle impostazioni globali.","Fai controlli periodici della memoria."],
    commonMistakes:["Mettere tutto nella Memoria invece che nelle Istruzioni.","Accumulo di ricordi non più utili.","Usare la Personalità per cambiare capacità invece che stile."],
    promptExamples:[{prompt:"Che cosa ricordi di me?",why:"Controlla la memoria."},{prompt:"Dimentica la preferenza per il tono formale.",why:"Pulizia mirata."},{prompt:"Riparti da zero. Nessuna preferenza memorizzata.",why:"Modalità stanza pulita."}],
    beforeAfter:{before:"Ho preferenze in memoria ma i risultati restano incoerenti.",after:"Metti le regole di comportamento nelle Istruzioni. I fatti nella Memoria. Le regole di dominio nelle istruzioni del progetto.",improvement:"Separazione corretta dei livelli."},
    visual:"memory" },
  { id:"projects", level:"power", number:"11", title:"I Progetti come sistema operativo personale", ico:"folderOpen", color:"#16a34a",
    summary:"I Progetti trasformano ChatGPT in un banco di lavoro consapevole del contesto. Un progetto ben configurato supera quasi sempre qualsiasi singola chat isolata.",
    whyItMatters:"Per il lavoro distribuito su più sessioni, i Progetti sono lo strumento organizzativo più potente.",
    beginnerMoves:["Un progetto per ogni flusso di lavoro. Dagli un nome chiaro.","Carica solo i file pertinenti.","Scrivi istruzioni specifiche del progetto."],
    advancedMoves:["Aggiungi riepiloghi delle conversazioni come file sorgente.","Mantieni il lavoro settimanale nello stesso progetto, non in nuove chat.","Crea un meta-progetto per la produttività personale."],
    commonMistakes:["Troppi progetti troppo stretti.","Caricare tutto: il contesto diventa gonfio.","Nessuna istruzione di progetto."],
    promptExamples:[{prompt:"Qual è la struttura ideale di un progetto per il mio semestre?",why:"Pianifica prima lo spazio di lavoro."},{prompt:"Scrivi un memo coerente con il lavoro già fatto.",why:"Sfrutta il contesto accumulato."},{prompt:"Riassumi le decisioni chiave delle ultime cinque conversazioni.",why:"Crea un riepilogo vivo e utile."}],
    beforeAfter:{before:"Ho file ovunque e perdo il filo.",after:"Un progetto per ogni area. Riferimenti. Istruzioni. Rientro costante. Riepiloghi periodici.",improvement:"Le conversazioni sparse diventano una struttura ordinata."},
    visual:"project" },
  { id:"gpts", level:"power", number:"12", title:"Quando creare un GPT, e quando no", ico:"bot", color:"#44403c",
    summary:"È utile quando un flusso di lavoro si ripete, ha istruzioni stabili e beneficia del riuso. Ma la maggior parte delle persone costruisce GPT troppo presto.",
    whyItMatters:"Un GPT creato prematuramente cristallizza un processo ancora immaturo. Un GPT costruito al momento giusto trasforma un metodo collaudato in uno strumento immediato.",
    beginnerMoves:["Salva prima i prompt: il prompt è il prototipo.","Formalizza solo dopo almeno tre ripetizioni.","Scopo ristretto. Un solo compito."],
    advancedMoves:["Quattro livelli: ruolo, istruzioni, conoscenza, strumenti.","Regole di fallimento esplicite.","Test avversariali."],
    commonMistakes:["Creare un GPT per qualcosa fatto una sola volta.","Essere troppo ampi: 'fa tutto'.","Nessun file di conoscenza."],
    promptExamples:[{prompt:"Trasforma il nostro flusso di lavoro in un blueprint per un GPT.",why:"Lo fa nascere dall'esperienza reale."},{prompt:"Definisci istruzioni, schema input/output e regole di fallimento.",why:"Specifica completa."},{prompt:"Quali casi limite dovrebbe gestire questo GPT?",why:"Test di robustezza."}],
    beforeAfter:{before:"Un GPT per gestire tutta la mia email.",after:"Un GPT per rispondere ai professori. Tono rispettoso e diretto. Massimo 150 parole. Chiede prima il contesto. Si rifiuta di procedere senza conferma. File caricato: guida di stile.",improvement:"Ambito ristretto, regole di sicurezza e riferimenti."},
    visual:"gpt" },
  { id:"canvas", level:"power", number:"13", title:"Canvas per revisioni di testi e codice", ico:"panelsTopLeft", color:"#334155",
    summary:"Superficie di lavoro visibile accanto alla chat. È migliore della conversazione lineare quando il documento è al centro e servono modifiche chirurgiche.",
    whyItMatters:"Gli artefatti lunghi soffrono in chat. Con Canvas il documento diventa il vero punto focale.",
    beginnerMoves:["Usa Canvas per artefatti lunghi.","Un file per ogni scopo.","Chiedi modifiche mirate, non riscritture vaghe."],
    advancedMoves:["Usa la chat per la strategia, Canvas per l'esecuzione.","Prima architettura, poi differenze mirate.","Usa la cronologia versioni per confrontare."],
    commonMistakes:["Usare la chat per documenti lunghi.","Riscrivere tutto quando basta correggere un paragrafo.","Non usare Canvas per il debug del codice."],
    promptExamples:[{prompt:"Apri in Canvas di scrittura. Riscrivi solo l'introduzione.",why:"Revisione delimitata."},{prompt:"Trova gli errori logici. Correggi solo quelle righe.",why:"Correzione mirata del codice."},{prompt:"Sposta la sezione 3 prima della 2 e unisci 4 e 5.",why:"Riorganizzazione strutturale."}],
    beforeAfter:{before:"Riscrivi il mio saggio. [2000 parole in chat]",after:"Aprilo in Canvas. Non modificare ancora nulla. Annota le sezioni forti e quelle deboli. Poi ti dirò io cosa intervenire.",improvement:"Prima ispezione, poi modifica."},
    visual:"canvas" },
  { id:"tasks-apps-agent", level:"expert", number:"14", title:"Attività, app, Pulse e Agent", ico:"workflow", color:"#16a34a",
    summary:"È il livello operativo. Le Attività eseguono dopo. Le App portano dentro i dati. Pulse fa ricerca asincrona. Agent svolge lavori autonomi in più passaggi.",
    whyItMatters:"Molti usano solo domande e risposte in tempo reale. Questo livello trasforma ChatGPT in un sistema che lavora per te.",
    beginnerMoves:["Attività: promemoria, briefing, riepiloghi ricorrenti.","App: quando le informazioni vivono in Drive, Slack o email.","Agent: flussi complessi che manualmente richiederebbero 15 minuti o più."],
    advancedMoves:["Scrivi i prompt per Agent come veri job brief con punti di arresto.","Usa Pulse per aggiornamenti proattivi su temi precisi.","Combina Attività e Progetti per riepiloghi automatici settimanali."],
    commonMistakes:["Non sapere che Agent esiste.","Dare istruzioni vaghe ad Agent senza regole di stop.","Usare Attività solo come promemoria."],
    promptExamples:[{prompt:"Attività quotidiana: briefing alle 8 su [tema], top 3.",why:"Briefing proattivo."},{prompt:"Analisi competitiva usando fonti pubbliche e fonti collegate.",why:"Dati interni ed esterni insieme."},{prompt:"Agent: esegui il flusso di lavoro. Fermati prima dell'invio.",why:"Autonomia con checkpoint."}],
    beforeAfter:{before:"Controlla cinque siti e confronta i prezzi.",after:"Agent: visita cinque concorrenti, estrai i prezzi e crea una tabella comparativa. Fermati se serve il login. Segnala i prezzi non aggiornati.",improvement:"Compito delegato con ambito chiaro e gestione degli errori."},
    visual:"agent" },
  { id:"model-choice", level:"expert", number:"15", title:"Scelta del modello e della modalità", ico:"compass", color:"#65a30d",
    summary:"Modalità diverse bilanciano velocità, profondità di ragionamento e supporto agli strumenti. La potenza va scelta in base al compito.",
    whyItMatters:"Usare sempre la modalità più potente fa perdere tempo. Non alzare mai il livello fa perdere profondità.",
    beginnerMoves:["Auto per il lavoro quotidiano.","Passa a una modalità più forte per logica complessa o sintesi difficili.","La modalità più potente non è sempre la migliore."],
    advancedMoves:["Usa la modalità veloce per le bozze e quella profonda per la revisione critica.","Controlla i limiti degli strumenti nelle modalità di ragionamento.","Inizia leggero e alza il livello a metà conversazione se serve."],
    commonMistakes:["Usare sempre la modalità più potente per tutto.","Dare la colpa al modello invece che alla modalità.","Non controllare cosa è disponibile nel proprio piano."],
    promptExamples:[{prompt:"Prima una risposta veloce, poi una seconda passata più profonda.",why:"Prima velocità, poi profondità."},{prompt:"Logica complessa. Ragionamento esteso, passo per passo.",why:"Richiesta esplicita di ragionamento approfondito."},{prompt:"Per questo compito è meglio una bozza rapida o un ragionamento accurato?",why:"Il modello aiuta a scegliere la modalità."}],
    beforeAfter:{before:"Usa sempre il modello più avanzato.",after:"Auto per i compiti rapidi. Modalità di ragionamento per la logica. Modalità veloce per il brainstorming.",improvement:"La potenza viene adattata al tipo di lavoro."},
    visual:"models" },
  { id:"privacy-risk", level:"expert", number:"16", title:"Privacy, controlli sui dati e rischio", ico:"shield", color:"#e11d48",
    summary:"Più capacità significa anche più confini da rispettare. I dati sensibili richiedono disciplina nel caricamento. Gli output ad alta posta richiedono revisione umana.",
    whyItMatters:"Capacità senza confini porta a esposizione dei dati o eccessiva dipendenza dall'AI.",
    beginnerMoves:["Non caricare contenuti sensibili con leggerezza.","Rimuovi gli identificatori prima del caricamento.","Usa la chat temporanea per la privacy più pulita possibile."],
    advancedMoves:["Politica di caricamento a semaforo: rosso, giallo, verde.","Revisione di un esperto prima di azioni ad alto rischio.","Audit periodico dei dati."],
    commonMistakes:["Caricare database interi quando basta un campione.","Pensare che la chat temporanea significhi assenza totale di trattamento.","Usare output AI come decisione finale in ambiti regolati."],
    promptExamples:[{prompt:"Quali parti richiedono verifica da parte di un esperto umano?",why:"Segnala i limiti."},{prompt:"Aiutami a fare il redacting prima di caricare tutto.",why:"Preparazione più sicura."},{prompt:"Che cosa qui è dato personale identificabile? Rimuovilo.",why:"Rilevamento di PII."}],
    beforeAfter:{before:"Ecco l'intero elenco clienti, analizza i trend.",after:"Rimuovi nomi, email e telefoni. Anonimizza le aziende. Poi analizza il fatturato per segmento.",improvement:"Oscura gli identificatori ma conserva il valore analitico."},
    visual:"privacy" },
];

/* ─────────────────────────────────────────────
   VISUAL SVG DELLE SEZIONI
   ───────────────────────────────────────────── */
function SectionVisual({ type }) {
  const s = "fill-none stroke-current";
  const cls = "h-36 w-full";
  const col = C.greenDeep;
  const tx = (x, y, label, opts = {}) => <text x={x} y={y} textAnchor="middle" fill={col} style={{ fontSize: opts.size || 10, fontWeight: opts.bold ? 600 : 400, opacity: opts.dim ? 0.4 : 1 }}>{label}</text>;
  const V = {
    mental: <svg viewBox="0 0 360 170" className={cls} style={{ color: col }}><rect x="24" y="12" width="120" height="44" rx="12" className={s} strokeWidth="2"/><rect x="216" y="12" width="120" height="44" rx="12" className={s} strokeWidth="2"/><rect x="120" y="110" width="120" height="44" rx="12" className={s} strokeWidth="2"/><path d="M144 34h72" className={s} strokeWidth="1.5"/><path d="M84 56l60 54M276 56l-60 54" className={s} strokeWidth="1.5"/>{tx(84,39,"Obiettivo",{bold:true})}{tx(276,39,"Bozza AI",{bold:true})}{tx(180,137,"Giudizio",{bold:true})}{tx(180,84,"verifica, decidi, agisci",{dim:true,size:9})}</svg>,
    layers: <svg viewBox="0 0 360 170" className={cls} style={{ color: col }}>{[["40","8","280","24","Chat normale"],["54","38","252","24","Progetti + Canvas"],["68","68","224","24","Memoria + Istruzioni"],["82","98","196","24","GPT + Studio + Skill"],["96","128","168","24","Attività + App + Agent"]].map(([x,y,w,h,l])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="10" className={s} strokeWidth="2"/>{tx(180,Number(y)+16,l,{bold:true,size:9})}</g>)}{tx(336,22,"semplice",{dim:true,size:8})}{tx(336,146,"potente",{dim:true,size:8})}</svg>,
    prompt: <svg viewBox="0 0 360 170" className={cls} style={{ color: col }}>{[["18","8","Obiettivo"],["126","8","Contesto"],["234","8","Regole"],["18","92","Formato"],["126","92","Qualità"],["234","92","Verifica"]].map(([x,y,l])=><g key={l}><rect x={x} y={y} width="102" height="50" rx="10" className={s} strokeWidth="2"/>{tx(Number(x)+51,Number(y)+30,l,{bold:true,size:11})}</g>)}</svg>,
    workflow: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}>{[["30","Imposta"],["100","Bozza"],["170","Critica"],["240","Rivedi"],["310","Consegna"]].map(([x,l],i)=><g key={l}><circle cx={x} cy="60" r="22" className={s} strokeWidth="2"/>{tx(Number(x),64,l,{bold:true,size:9})}{i<4&&<path d={`M${Number(x)+22} 60h26`} className={s} strokeWidth="1.5"/>}</g>)}{tx(170,112,"ogni passaggio aggiunge precisione",{dim:true,size:9})}</svg>,
    writing: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}><rect x="20" y="14" width="92" height="90" rx="10" className={s} strokeWidth="2"/><rect x="134" y="14" width="92" height="90" rx="10" className={s} strokeWidth="2"/><rect x="248" y="14" width="92" height="90" rx="10" className={s} strokeWidth="2"/><path d="M112 59h22M226 59h22" className={s} strokeWidth="1.5"/>{tx(66,38,"Fonte",{bold:true})}{tx(180,38,"Trasforma",{bold:true})}{tx(294,38,"Output",{bold:true})}</svg>,
    data: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}><rect x="20" y="10" width="116" height="96" rx="10" className={s} strokeWidth="2"/><path d="M20 36h116M48 10v96M76 10v96M104 10v96M20 62h116M20 88h116" className={s} strokeWidth="1"/><rect x="186" y="18" width="24" height="70" rx="6" className={s} strokeWidth="2"/><rect x="220" y="40" width="24" height="48" rx="6" className={s} strokeWidth="2"/><rect x="254" y="28" width="24" height="60" rx="6" className={s} strokeWidth="2"/><rect x="288" y="48" width="24" height="40" rx="6" className={s} strokeWidth="2"/><path d="M182 100h136" className={s} strokeWidth="1.5"/>{tx(78,126,"1. Ispeziona",{dim:true,size:9})}{tx(252,126,"2. Concludi",{dim:true,size:9})}</svg>,
    research: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}><circle cx="66" cy="58" r="32" className={s} strokeWidth="2"/><path d="M90 82l22 22" className={s} strokeWidth="2"/><rect x="170" y="10" width="144" height="28" rx="8" className={s} strokeWidth="2"/><rect x="170" y="50" width="144" height="28" rx="8" className={s} strokeWidth="2"/><rect x="170" y="90" width="144" height="28" rx="8" className={s} strokeWidth="2"/>{tx(242,29,"Primarie",{bold:true})}{tx(242,69,"Secondarie",{bold:true})}{tx(242,109,"Inferenza",{bold:true})}<circle cx="326" cy="24" r="4" fill="#10a37f" stroke="none"/><circle cx="326" cy="64" r="4" fill="#F59E0B" stroke="none"/><circle cx="326" cy="104" r="4" fill="#E11D48" stroke="none" opacity="0.5"/></svg>,
    multimodal: <svg viewBox="0 0 360 130" className={cls} style={{ color: col }}>{[["36","Testo"],["120","Immagine"],["204","Voce"],["288","Modifica"]].map(([x,l])=><g key={l}><rect x={x} y="20" width="52" height="52" rx="12" className={s} strokeWidth="2"/>{tx(Number(x)+26,50,l,{bold:true,size:9})}</g>)}<path d="M88 46h32M172 46h32M256 46h32" className={s} strokeWidth="1.5"/>{tx(180,102,"combina le modalità",{dim:true,size:9})}</svg>,
    collab: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}>{[["18","24","64","42","Registra"],["100","6","120","42","Studio"],["100","78","120","42","Gruppo"],["238","24","80","42","Condividi"]].map(([x,y,w,h,l])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="10" className={s} strokeWidth="2"/>{tx(Number(x)+Number(w)/2,Number(y)+26,l,{bold:true,size:10})}</g>)}<path d="M82 45h18M220 27h18M220 99h18" className={s} strokeWidth="1.5"/></svg>,
    memory: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}>{[["14","10","74","40","Memoria"],["100","10","120","40","Istruzioni"],["232","10","108","40","Personalità"]].map(([x,y,w,h,l])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="10" className={s} strokeWidth="2"/>{tx(Number(x)+Number(w)/2,Number(y)+25,l,{bold:true,size:10})}</g>)}<rect x="60" y="88" width="240" height="40" rx="12" className={s} strokeWidth="2"/>{tx(180,113,"Output coerente",{bold:true})}<path d="M51 50l38 38M160 50v38M286 50l-38 38" className={s} strokeWidth="1.5"/></svg>,
    project: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}><rect x="28" y="4" width="304" height="132" rx="16" className={s} strokeWidth="2"/><rect x="46" y="28" width="72" height="88" rx="8" className={s} strokeWidth="2"/><rect x="130" y="28" width="72" height="88" rx="8" className={s} strokeWidth="2"/><rect x="214" y="28" width="100" height="40" rx="8" className={s} strokeWidth="2"/><rect x="214" y="76" width="100" height="40" rx="8" className={s} strokeWidth="2"/>{tx(82,76,"Chat",{bold:true})}{tx(166,76,"File",{bold:true})}{tx(264,52,"Fonti",{bold:true,size:9})}{tx(264,100,"Regole",{bold:true,size:9})}</svg>,
    gpt: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}>{[["16","48","78","42","Ruolo"],["116","4","96","42","Conoscenza"],["116","94","96","42","Strumenti"],["234","48","110","42","Regole"]].map(([x,y,w,h,l])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="10" className={s} strokeWidth="2"/>{tx(Number(x)+Number(w)/2,Number(y)+26,l,{bold:true,size:10})}</g>)}<path d="M94 69h22M212 25h22M212 115h22" className={s} strokeWidth="1.5"/><path d="M164 46v48" className={s} strokeWidth="1.5"/></svg>,
    canvas: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}><rect x="20" y="4" width="320" height="132" rx="14" className={s} strokeWidth="2"/><path d="M20 32h320" className={s} strokeWidth="1.5"/><path d="M132 32v104M248 32v104" className={s} strokeWidth="1.2"/>{tx(76,22,"Scaletta",{bold:true,size:10})}{tx(190,22,"Bozza",{bold:true,size:10})}{tx(290,22,"Modifiche",{bold:true,size:10})}</svg>,
    agent: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}>{[["10","48","60","40","Obiettivo"],["90","6","64","40","Naviga"],["90","94","64","40","File"],["174","6","64","40","App"],["174","94","64","40","Codice"],["258","48","80","40","Fatto"]].map(([x,y,w,h,l])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="9" className={s} strokeWidth="2"/>{tx(Number(x)+Number(w)/2,Number(y)+24,l,{bold:true,size:9})}</g>)}<path d="M70 68h20M122 46v48M154 26h20M154 114h20M238 26l20 40M238 114l20-40" className={s} strokeWidth="1.5"/></svg>,
    models: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}>{[["20","48","72","40","Auto"],["116","4","72","40","Rapido"],["116","96","72","40","Profondo"],["268","48","72","40","Pro"]].map(([x,y,w,h,l])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="10" className={s} strokeWidth="2"/>{tx(Number(x)+Number(w)/2,Number(y)+25,l,{bold:true,size:10})}</g>)}<path d="M92 68h24M188 24h80M188 116h80" className={s} strokeWidth="1.5"/><path d="M152 44v52" className={s} strokeWidth="1.5"/></svg>,
    privacy: <svg viewBox="0 0 360 150" className={cls} style={{ color: col }}><path d="M180 8l88 32v44c0 34-26 62-88 80-62-18-88-46-88-80V40l88-32z" className={s} strokeWidth="2"/><path d="M150 82l18 18 40-42" className={s} strokeWidth="2.2"/>{tx(180,142,"più capacità richiede più confini",{dim:true,size:9})}</svg>,
  };
  return V[type] || null;
}

/* ─────────────────────────────────────────────
   SOTTOCOMPONENTI
   ───────────────────────────────────────────── */
function FeatureCard({ title, ico, color, description, when }) {
  return (
    <div className="rounded-2xl border bg-white p-5 transition-shadow duration-200 hover:shadow-md" style={{ borderColor: C.border }}>
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: color + "14" }}><Ico name={ico} className="h-4 w-4" style={{ color }} /></div>
        <span className="ff-display text-[15px] font-semibold" style={{ color: C.ink }}>{title}</span>
      </div>
      <p className="text-[13px] leading-relaxed" style={{ color: C.inkLight }}>{description}</p>
      {when && <div className="mt-3 rounded-xl px-3 py-2 text-[12px] leading-relaxed" style={{ backgroundColor: C.cream, color: C.inkLight }}><span className="font-semibold" style={{ color: C.greenDeep }}>Quando: </span>{when}</div>}
    </div>
  );
}

function MiniFeature({ title, ico, color, description }) {
  return (
    <div className="rounded-2xl border bg-white p-4 transition-shadow hover:shadow-sm" style={{ borderColor: C.border }}>
      <div className="mb-2 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ backgroundColor: color + "14" }}><Ico name={ico} className="h-3.5 w-3.5" style={{ color }} /></div>
        <span className="text-[13px] font-semibold" style={{ color: C.ink }}>{title}</span>
      </div>
      <p className="text-[12px] leading-relaxed" style={{ color: C.inkLight }}>{description}</p>
    </div>
  );
}

function BeforeAfterBlock({ data }) {
  return (
    <div className="rounded-2xl border p-5" style={{ borderColor: C.border, backgroundColor: C.cream }}>
      <div className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>Prima vs dopo</div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-red-400">Debole</div>
          <div className="ff-mono break-words text-[12px] leading-relaxed" style={{ color: C.ink }}>{data.before}</div>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-600">Forte</div>
          <div className="ff-mono break-words text-[12px] leading-relaxed" style={{ color: C.ink }}>{data.after}</div>
        </div>
      </div>
      <div className="mt-3 flex items-start gap-2 text-[12px] leading-relaxed" style={{ color: C.greenDeep }}>
        <Ico name="lightbulb" className="mt-0.5 h-3.5 w-3.5 shrink-0" /><span className="font-medium">{data.improvement}</span>
      </div>
    </div>
  );
}

function PromptExample({ prompt, why }) {
  return (
    <div className="rounded-xl border bg-white px-4 py-3" style={{ borderColor: C.borderLight }}>
      <div className="ff-mono break-words text-[12px] leading-relaxed" style={{ color: C.ink }}>{prompt}</div>
      <div className="mt-1.5 text-[11px] leading-snug" style={{ color: C.inkMuted }}>{why}</div>
    </div>
  );
}

function GuideSectionCard({ section, isExpanded, onToggle }) {
  return (
    <section id={section.id} className="scroll-mt-28 overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow duration-200 hover:shadow-md" style={{ borderColor: C.border }}>
      <button onClick={onToggle} className="flex w-full items-start gap-4 p-5 text-left md:items-center md:p-6">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white" style={{ backgroundColor: section.color }}><Ico name={section.ico} className="h-5 w-5" /></div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>{section.number} &middot; {section.level.charAt(0).toUpperCase() + section.level.slice(1)}</div>
          <h3 className="ff-display text-[17px] font-semibold leading-snug md:text-[19px]" style={{ color: C.ink }}>{section.title}</h3>
          {!isExpanded && <p className="clamp-2 mt-1 text-[13px] leading-relaxed" style={{ color: C.inkLight }}>{section.summary}</p>}
        </div>
        <Ico name="chevronDown" className={`mt-1 h-5 w-5 shrink-0 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} style={{ color: C.inkMuted }} />
      </button>
      {isExpanded && (
        <div className="border-t px-5 pb-7 pt-6 md:px-6" style={{ borderColor: C.borderLight }}>
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <p className="text-[14px] leading-[1.8]" style={{ color: C.ink }}>{section.summary}</p>
              <div className="rounded-xl border p-4" style={{ borderColor: C.borderLight, backgroundColor: C.cream }}>
                <div className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>Perché conta</div>
                <p className="mt-2 text-[13px] leading-[1.75]" style={{ color: C.ink }}>{section.whyItMatters}</p>
              </div>
              <div>
                <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.greenDeep }}>Da qui si parte</div>
                <div className="space-y-2.5">{section.beginnerMoves.map((m, i) => <div key={i} className="flex gap-2.5 text-[13px] leading-relaxed" style={{ color: C.ink }}><Ico name="checkCircle" className="mt-0.5 h-4 w-4 shrink-0" style={{ color: C.greenMid }} /><span>{m}</span></div>)}</div>
              </div>
              <div>
                <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>Avanzato</div>
                <div className="space-y-2.5">{section.advancedMoves.map((m, i) => <div key={i} className="flex gap-2.5 text-[13px] leading-relaxed" style={{ color: C.ink }}><Ico name="arrowRight" className="mt-0.5 h-4 w-4 shrink-0" style={{ color: C.inkMuted }} /><span>{m}</span></div>)}</div>
              </div>
              <div>
                <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.roseAccent }}>Errori comuni</div>
                <div className="space-y-2.5">{section.commonMistakes.map((m, i) => <div key={i} className="flex gap-2.5 text-[13px] leading-relaxed" style={{ color: C.ink }}><Ico name="alertTriangle" className="mt-0.5 h-4 w-4 shrink-0 opacity-60" style={{ color: C.roseAccent }} /><span>{m}</span></div>)}</div>
              </div>
              <BeforeAfterBlock data={section.beforeAfter} />
            </div>
            <div className="space-y-6">
              <div className="rounded-2xl border p-4" style={{ borderColor: C.borderLight, backgroundColor: C.cream }}>
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>Modello visivo</div>
                <SectionVisual type={section.visual} />
              </div>
              <div>
                <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>Esempi di prompt</div>
                <div className="space-y-2.5">{section.promptExamples.map((p, i) => <PromptExample key={i} {...p} />)}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* ─────────────────────────────────────────────
   PRINCIPALE
   ───────────────────────────────────────────── */
export default function ChatGPTMasterGuide() {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("all");
  const [expanded, setExpanded] = useState(new Set(["mental-model"]));
  const toggleSection = useCallback((id) => { setExpanded(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; }); }, []);
  const expandAll = useCallback(() => setExpanded(new Set(GUIDE_SECTIONS.map(s => s.id))), []);
  const collapseAll = useCallback(() => setExpanded(new Set()), []);

  const filteredSections = useMemo(() => GUIDE_SECTIONS.filter(s => {
    if (level !== "all" && s.level !== level) return false;
    if (!query.trim()) return true;
    return [s.title, s.summary, s.whyItMatters, ...s.beginnerMoves, ...s.advancedMoves, ...s.commonMistakes, ...s.promptExamples.map(p => p.prompt), s.beforeAfter.before, s.beforeAfter.after].join(" ").toLowerCase().includes(query.toLowerCase());
  }), [level, query]);

  const sectionsByLevel = useMemo(() => {
    const g = { foundation: [], core: [], power: [], expert: [] };
    filteredSections.forEach(s => g[s.level]?.push(s));
    return g;
  }, [filteredSections]);
  const levelLabels = { foundation: "Base", core: "Competenze essenziali", power: "Funzioni avanzate", expert: "Esperto" };

  return (
    <div className="ff-body min-h-screen" style={{ backgroundColor: C.cream, color: C.ink }}>
      <GlobalStyles />
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-10">

        {/* HEADER */}
        <header className="overflow-hidden rounded-3xl border" style={{ borderColor: C.borderLight, background: `linear-gradient(135deg, ${C.greenLight} 0%, ${C.cream} 40%, ${C.creamDark} 100%)` }}>
          <div className="grid gap-6 p-6 md:p-10 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-widest" style={{ borderColor: C.borderLight, color: C.greenDeep }}><Ico name="bookOpen" className="h-3.5 w-3.5" /> Riferimento pratico</div>
              <h1 className="ff-display text-3xl font-medium leading-tight tracking-tight md:text-[44px] md:leading-tight" style={{ color: C.ink }}>Guida completa a ChatGPT</h1>
              <p className="mt-4 max-w-lg text-[15px] leading-[1.8]" style={{ color: C.inkLight }}>Che cosa fa ogni strumento, quando usarlo e come ottenere risultati misurabilmente migliori. Scritta prima di tutto per gli utenti di tutti i giorni, con sezioni più approfondite per chi vuole andare oltre.</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-medium shadow-sm" style={{ color: C.inkLight }}><Ico name="lightbulb" className="h-3 w-3" style={{ color: C.greenMid }} /> Verificato {VERIFIED_DATE}</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-medium shadow-sm" style={{ color: C.inkLight }}><Ico name="layers" className="h-3 w-3" style={{ color: C.greenMid }} /> 16 sezioni &middot; oltre 60 prompt</span>
              </div>
            </div>
            <div className="rounded-2xl border bg-white p-5 shadow-sm" style={{ borderColor: C.borderLight }}>
              <div className="mb-3 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>Cosa fa oggi ChatGPT</div>
              <svg viewBox="0 0 420 190" className="w-full" style={{ color: C.greenDeep }}>
                {[["16","4","120","38","Rispondere","chat, ricerca"],["150","4","120","38","Organizzare","progetti, memoria"],["284","4","120","38","Creare","canvas, immagini"],["16","120","120","38","Imparare","studio, registra"],["150","120","120","38","Condividere","gruppi, link"],["284","120","120","38","Eseguire","attività, agent"]].map(([x,y,w,h,l,sub])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="9" className="fill-none stroke-current" strokeWidth="1.6"/><text x={Number(x)+Number(w)/2} y={Number(y)+18} textAnchor="middle" fill={C.greenDeep} style={{fontSize:10,fontWeight:600}}>{l}</text><text x={Number(x)+Number(w)/2} y={Number(y)+30} textAnchor="middle" fill={C.greenDeep} style={{fontSize:7,opacity:0.4}}>{sub}</text></g>)}
                <text x="210" y="84" textAnchor="middle" fill={C.greenDeep} style={{fontSize:9,fontWeight:600,opacity:0.25}}>l'intero stack</text>
                {[[136,23,150,23],[270,23,284,23],[76,42,76,120],[210,42,210,120],[344,42,344,120]].map(([x1,y1,x2,y2],i)=><line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.greenDeep} strokeWidth="1" opacity="0.15"/>)}
              </svg>
            </div>
          </div>
        </header>

        {/* SEI PRINCIPI */}
        <section className="mt-8">
          <div className="mb-4 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>Sei principi</div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[{ico:"penTool",t:"Chiedi con chiarezza",d:"Obiettivo, contesto, vincoli, formato."},{ico:"layoutGrid",t:"Scegli il livello giusto",d:"Chat, progetto, canvas, ricerca, agent."},{ico:"shield",t:"Verifica quando conta",d:"Usa la ricerca per ciò che è attuale o delicato."},{ico:"refreshCcw",t:"Rivedi, non ricominciare",d:"I buoni risultati nascono spesso al secondo passaggio."},{ico:"bot",t:"Trasforma ciò che funziona in sistema",d:"Progetto, GPT, attività o skill."},{ico:"eye",t:"Usa i visual per pensare più in fretta",d:"Tabelle, diagrammi, screenshot."}].map(({ico,t,d})=>(
              <div key={t} className="flex gap-3 rounded-2xl border bg-white p-4" style={{borderColor:C.border}}>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white" style={{backgroundColor:C.greenDeep}}><Ico name={ico} className="h-4 w-4"/></div>
                <div><div className="text-[13px] font-semibold" style={{color:C.ink}}>{t}</div><div className="mt-0.5 text-[12px] leading-relaxed" style={{color:C.inkLight}}>{d}</div></div>
              </div>
            ))}
          </div>
        </section>

        {/* SCELTA DELLO STRUMENTO */}
        <section className="mt-8 overflow-hidden rounded-2xl border bg-white p-5 shadow-sm md:p-7" style={{borderColor:C.border}}>
          <div className="mb-5">
            <div className="text-[11px] font-semibold uppercase tracking-widest" style={{color:C.inkMuted}}>Tabella decisionale</div>
            <h2 className="ff-display mt-1 text-[22px] font-medium tracking-tight" style={{color:C.ink}}>Quale strumento dovresti usare?</h2>
          </div>
          <div className="overflow-x-auto rounded-xl border" style={{borderColor:C.borderLight}}>
            <table className="min-w-full text-left text-[13px]">
              <thead><tr style={{backgroundColor:C.cream}}><th className="whitespace-nowrap px-4 py-3 font-semibold" style={{color:C.ink}}>Il tuo obiettivo</th><th className="whitespace-nowrap px-4 py-3 font-semibold" style={{color:C.ink}}>Strumento migliore</th><th className="hidden whitespace-nowrap px-4 py-3 font-semibold sm:table-cell" style={{color:C.ink}}>Perché</th></tr></thead>
              <tbody>{TOOL_CHOOSER.map((r,i)=><tr key={r.goal} style={{backgroundColor:i%2===0?"#fff":C.cream}}><td className="px-4 py-3 font-medium" style={{color:C.ink}}>{r.goal}</td><td className="whitespace-nowrap px-4 py-3"><span className="inline-flex items-center gap-1.5 font-semibold" style={{color:C.greenDeep}}><Ico name={r.ico} className="h-3.5 w-3.5"/>{r.tool}</span></td><td className="hidden px-4 py-3 sm:table-cell" style={{color:C.inkLight}}>{r.reason}</td></tr>)}</tbody>
            </table>
          </div>
        </section>

        {/* FORMULA DEL PROMPT */}
        <section className="mt-8 rounded-2xl border bg-white p-5 shadow-sm md:p-7" style={{borderColor:C.border}}>
          <div className="mb-5">
            <div className="text-[11px] font-semibold uppercase tracking-widest" style={{color:C.inkMuted}}>Schema del prompt</div>
            <h2 className="ff-display mt-1 text-[22px] font-medium tracking-tight" style={{color:C.ink}}>Sei blocchi che migliorano qualsiasi prompt</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PROMPT_BLOCKS.map((b,i)=><div key={b.label} className="rounded-xl border p-4" style={{borderColor:C.borderLight,backgroundColor:C.cream}}>
              <div className="mb-1.5 flex items-center gap-2"><span className="flex h-5 w-5 items-center justify-center rounded-md text-[10px] font-bold text-white" style={{backgroundColor:b.color}}>{i+1}</span><span className="text-[13px] font-semibold" style={{color:C.ink}}>{b.label}</span></div>
              <p className="ff-mono text-[11px] leading-relaxed" style={{color:C.inkLight}}>{b.example}</p>
            </div>)}
          </div>
        </section>

        {/* FUNZIONI PRINCIPALI */}
        <section className="mt-8 rounded-2xl border bg-white p-5 shadow-sm md:p-7" style={{borderColor:C.border}}>
          <div className="mb-5">
            <div className="text-[11px] font-semibold uppercase tracking-widest" style={{color:C.inkMuted}}>Stack delle funzioni</div>
            <h2 className="ff-display mt-1 text-[22px] font-medium tracking-tight" style={{color:C.ink}}>Gli strumenti principali di ChatGPT</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{CORE_FEATURES.map(f=><FeatureCard key={f.title} {...f}/>)}</div>
        </section>

        {/* AGGIUNTIVE */}
        <section className="mt-8 rounded-2xl border bg-white p-5 shadow-sm md:p-7" style={{borderColor:C.border}}>
          <div className="mb-5">
            <div className="text-[11px] font-semibold uppercase tracking-widest" style={{color:C.inkMuted}}>Spesso trascurate</div>
            <h2 className="ff-display mt-1 text-[22px] font-medium tracking-tight" style={{color:C.ink}}>Le funzioni che la maggior parte degli utenti si perde</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{ADDITIONAL_FEATURES.map(f=><MiniFeature key={f.title} {...f}/>)}</div>
        </section>

        {/* NAVIGATORE */}
        <section className="sticky top-0 z-20 mt-8 rounded-2xl border bg-white p-4 shadow-lg md:p-5" style={{borderColor:C.border}}>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative mr-auto">
              <Ico name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{color:C.inkMuted}}/>
              <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Cerca..." className="w-full rounded-xl border py-2 pl-10 pr-3 text-[13px] outline-none sm:w-48" style={{borderColor:C.border,backgroundColor:C.cream}}/>
            </div>
            {LEVELS.map(l=><button key={l.key} onClick={()=>setLevel(l.key)} className="rounded-lg px-3 py-2 text-[11px] font-semibold uppercase tracking-wide transition-all" style={level===l.key?{backgroundColor:C.greenDeep,color:"#fff"}:{border:`1px solid ${C.border}`,color:C.inkLight}}>{l.label}</button>)}
            <button onClick={expandAll} className="rounded-lg border px-2.5 py-2 text-[11px] font-medium" style={{borderColor:C.border,color:C.inkLight}}>Espandi</button>
            <button onClick={collapseAll} className="rounded-lg border px-2.5 py-2 text-[11px] font-medium" style={{borderColor:C.border,color:C.inkLight}}>Riduci</button>
          </div>
        </section>

        {/* SEZIONI DELLA GUIDA */}
        <main className="mt-8 space-y-10">
          {Object.entries(sectionsByLevel).map(([lev, sections]) => {
            if (!sections.length) return null;
            return (<div key={lev}>
              <div className="mb-4 flex items-center gap-3"><div className="h-px flex-1" style={{backgroundColor:C.border}}/><span className="whitespace-nowrap text-[12px] font-semibold uppercase tracking-widest" style={{color:C.inkMuted}}>{levelLabels[lev]}</span><div className="h-px flex-1" style={{backgroundColor:C.border}}/></div>
              <div className="space-y-4">{sections.map(s=><GuideSectionCard key={s.id} section={s} isExpanded={expanded.has(s.id)} onToggle={()=>toggleSection(s.id)}/>)}</div>
            </div>);
          })}
        </main>

        {/* AMBITO + CONCLUSIONE */}
        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border bg-white p-5 shadow-sm" style={{borderColor:C.border}}>
            <div className="text-[11px] font-semibold uppercase tracking-widest" style={{color:C.inkMuted}}>Ambito</div>
            <h3 className="ff-display mt-2 text-[18px] font-medium" style={{color:C.ink}}>Che cosa copre questa guida</h3>
            <div className="mt-4 space-y-2 text-[13px] leading-relaxed" style={{color:C.inkLight}}>
              <div className="rounded-xl px-4 py-2.5" style={{backgroundColor:C.cream}}>Funzioni lato utente, non amministrazione enterprise.</div>
              <div className="rounded-xl px-4 py-2.5" style={{backgroundColor:C.cream}}>Uso pratico prima della curiosità sul prodotto.</div>
              <div className="rounded-xl px-4 py-2.5" style={{backgroundColor:C.cream}}>Disponibilità variabile in base al piano e alla piattaforma.</div>
            </div>
          </div>
          <div className="rounded-2xl border border-emerald-200 p-5 shadow-sm" style={{background:`linear-gradient(135deg, ${C.greenLight}, #F0FAF5)`}}>
            <div className="text-[11px] font-semibold uppercase tracking-widest" style={{color:C.greenDeep}}>Il salto più importante</div>
            <div className="mt-3 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white" style={{backgroundColor:C.greenDeep}}><Ico name="sparkles" className="h-5 w-5"/></div>
              <div>
                <div className="ff-display text-[16px] font-semibold" style={{color:C.greenDeep}}>Smetti di chiederti "Come faccio a scrivere prompt migliori?"</div>
                <p className="mt-2 text-[13px] leading-[1.75] opacity-80" style={{color:C.greenDeep}}>Inizia a chiederti "Quale livello di ChatGPT è adatto a questo lavoro?" Questo cambio mentale migliora i risultati più di qualsiasi trucco di prompting.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mt-8 overflow-hidden rounded-3xl p-6 text-white shadow-lg md:p-10" style={{background:"linear-gradient(135deg, #0A2A1F, #0D3B2E 40%, #143D30)"}}>
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-widest text-emerald-300">Messaggio finale</div>
              <h2 className="ff-display mt-2 text-2xl font-medium tracking-tight md:text-[28px]">Che cosa significa davvero padroneggiarlo</h2>
              <p className="mt-4 max-w-xl text-[14px] leading-[1.85] text-emerald-100" style={{opacity:0.8}}>Scegli la modalità corretta. Definisci il lavoro con chiarezza. Verifica ciò che conta. Rivedi con intelligenza. Trasforma ciò che funziona in sistemi riutilizzabili. I migliori utenti sono persone che pensano con chiarezza e che, in più, usano bene l'AI.</p>
              <p style={{ fontSize: 13, lineHeight: 1.7 }}>
              <br />
              Guida utente di ChatGPT
              <br />
              © 2026 EugeneYip.com Tutti i diritti riservati. 
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-[13px] font-semibold">Da ricontrollare periodicamente</div>
              <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[12px] leading-relaxed text-emerald-200" style={{opacity:0.7}}>
                {["Funzionalità","Prezzi","Note di rilascio","Progetti","FAQ sulla memoria","Canvas","Attività","App","Ricerca","Ricerca approfondita","Modalità studio","Registra","Link condivisi","Gruppi","Skill","Agent","Voce","FAQ sulle immagini"].map(i=><div key={i} className="flex items-center gap-1.5"><div className="h-1 w-1 shrink-0 rounded-full bg-emerald-400" style={{opacity:0.5}}/>{i}</div>)}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
