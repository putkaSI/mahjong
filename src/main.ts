// Zagon: pisave, slogi, simboli ploščic, ozadje in prvi zaslon.
import "@fontsource/source-sans-3/latin-400.css";
import "@fontsource/source-sans-3/latin-ext-400.css";
import "@fontsource/source-sans-3/latin-700.css";
import "@fontsource/source-sans-3/latin-ext-700.css";
import "@fontsource/dm-serif-display/latin-400.css";
import "@fontsource/dm-serif-display/latin-ext-400.css";
import "./slog.css";
import { registerSW } from "virtual:pwa-register";
import { vstaviSimbole } from "./art/ploscice";
import { S, preberiPovezavo, prosiZaTrajnoShrambo } from "./shramba";
import { zazeniDelce } from "./ozadje";
import { odkleniZvokObKliku, nadzorujFokus } from "./zvok";
import { nav } from "./ui/nav";
import { domov, potovanje, postavitve } from "./ui/zasloni";
import { nastavitve, pomoc } from "./ui/nastavitve";
import { nadaljuj } from "./ui/igralni";

preberiPovezavo();
prosiZaTrajnoShrambo();
vstaviSimbole(S.nastavitve.slogPloscic);
Object.assign(nav, { domov, potovanje, postavitve, nastavitve, pomoc, nadaljuj });
document.body.dataset.mehko = String(S.nastavitve.mehko);
zazeniDelce();
odkleniZvokObKliku();
nadzorujFokus();
// ob odprtju takoj tja, kjer je ostala
if (S.igra) nadaljuj(); else domov();
registerSW({ immediate: true });
