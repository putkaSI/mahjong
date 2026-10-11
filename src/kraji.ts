// Potovanje po svetu: kraji po vrsti, vsak s štirimi stopnjami (postavitvami) in sliko.
export type Kraj = { id: string; ime: string; opis: string; stopnje: string[] };

export const KRAJI: Kraj[] = [
  { id: "ljubljana", ime: "Ljubljana", opis: "Potovanje se začne doma: zmaji na mostu in grad na zelenem griču.", stopnje: ["zmaj-1", "most-1", "grad-1", "srce-1"] },
  { id: "bled", ime: "Bled", opis: "Otok s cerkvico sredi jezera in grad na skali.", stopnje: ["otok-1", "hisa-1", "krog-1", "metulj-1"] },
  { id: "piran", ime: "Piran", opis: "Zvonik, rdeče strehe in mirno morje.", stopnje: ["riba-1", "valovi-1", "sonce-1", "ladja-1"] },
  { id: "benetke", ime: "Benetke", opis: "Gondole drsijo pod kamnitimi mostovi.", stopnje: ["most-2", "ladja-2", "okno-1", "lampijon-1"] },
  { id: "toskana", ime: "Toskana", opis: "Valoviti griči, cipresa ob cipresi in zlata polja.", stopnje: ["gora-1", "drevo-1", "hisa-2", "roza-1"] },
  { id: "alpe", ime: "Švicarske Alpe", opis: "Zasneženi vrhovi nad zelenimi pašniki.", stopnje: ["gora-2", "drevo-2", "hisa-3", "stopnice-1"] },
  { id: "pariz", ime: "Pariz", opis: "Eifflov stolp v jutranji meglici nad Seno.", stopnje: ["zvezda-1", "lijak-1", "srce-2", "okvir-1"] },
  { id: "santorini", ime: "Santorini", opis: "Bele hiše z modrimi kupolami na pečini nad morjem.", stopnje: ["kriz-1", "valovi-2", "sonce-2", "obroc-1"] },
  { id: "istanbul", ime: "Istanbul", opis: "Kupole in minareti nad Bosporjem.", stopnje: ["luna-1", "lampijon-2", "zvezda-2", "pahljaca-1"] },
  { id: "egipt", ime: "Egipt", opis: "Piramide v puščavi in palme ob Nilu.", stopnje: ["piramida-1", "piramida-2", "diamant-1", "pescena-ura-1"] },
  { id: "indija", ime: "Indija", opis: "Tadž Mahal se zrcali v dolgem bazenu.", stopnje: ["lokvanj-1", "vaza-1", "pahljaca-2", "diamant-2"] },
  { id: "himalaja", ime: "Himalaja", opis: "Molilne zastavice na grebenu pod najvišjimi gorami sveta.", stopnje: ["gora-3", "stopnice-2", "zvezda-3", "ix-1"] },
  { id: "angkor", ime: "Angkor Vat", opis: "Starodavni tempelj ob ribniku z lotosi ob sončnem vzhodu.", stopnje: ["stolpi-1", "grad-2", "lokvanj-2", "sahovnica-1"] },
  { id: "halong", ime: "Zaliv Ha Long", opis: "Apnenčasti otoki rastejo iz mirne vode.", stopnje: ["valovi-3", "otok-2", "ladja-3", "riba-2"] },
  { id: "guilin", ime: "Guilin", opis: "Bambusov splav na reki med meglenimi vršaci.", stopnje: ["dezevnik-1", "polz-1", "otok-3", "riba-3"] },
  { id: "zid", ime: "Kitajski zid", opis: "Zid se vije po meglenih grebenih od stolpa do stolpa.", stopnje: ["zid-1", "zid-2", "zid-3", "zelva"] },
  { id: "peking", ime: "Peking", opis: "Zlate strehe in rdeči zidovi Prepovedanega mesta.", stopnje: ["pagoda-1", "okno-2", "grad-3", "kriz-2"] },
  { id: "huangshan", ime: "Rumene gore", opis: "Granitni vrhovi in zviti bori nad morjem oblakov.", stopnje: ["obroc-2", "piramida-3", "pescena-ura-2", "lijak-2"] },
  { id: "suzhou", ime: "Suzhou", opis: "Klasičen vrt z mesečevimi vrati in ribnikom s krapi.", stopnje: ["roza-2", "lokvanj-3", "krog-2", "okvir-2"] },
  { id: "kjoto", ime: "Kjoto", opis: "Lesena pagoda med cvetočimi češnjami.", stopnje: ["pagoda-2", "metulj-2", "most-3", "ptica-1"] },
  { id: "fudzi", ime: "Fudži", opis: "Zasnežen vrh nad mirnim jezerom in bori.", stopnje: ["diamant-3", "ptica-2", "lampijon-3", "vaza-2"] },
  { id: "bali", ime: "Bali", opis: "Zlato zelene riževe terase med palmami.", stopnje: ["stopnice-3", "stolpi-2", "roza-3", "macka-1"] },
  { id: "dom", ime: "Spet doma", opis: "Kozolec, cerkvica na griču in sadovnjaki v večernem soncu. Dobrodošla doma!", stopnje: ["srce-3", "pes-1", "macka-2", "metulj-3"] },
];
export const kraj = (id: string) => KRAJI.find(k => k.id === id);
