// Slogi ploščic, ki jih naslika umetna inteligenca (Qwen-Image-Edit) na podlagi natančnih risb lic.
const OHRANI = "Change only the material and surface texture. Keep every symbol exactly as it is: the same shapes, the same number of items, the same positions and sizes, the same Chinese characters, and the same color of each symbol (dark navy stays dark navy, red stays red, green stays green, blue stays blue). "
  + "Do not add any new symbols, characters, letters, gems, ornaments or decorations, and do not remove any. "
  + "Show only the flat tile face, viewed straight on, filling the entire image edge to edge. No tile edges, no perspective, no background.";

export const SLOGI_AI = {
  starinski: { ime: "Starinski", vir: "klasicen", seme: 1925, opis: "Starinske ploščice iz bakelita z vgraviranimi, ročno pobarvanimi znaki",
    navodilo: "Turn this into the face of an antique 1920s mahjong tile made of warm butterscotch bakelite. The symbols are engraved into the surface and filled with slightly faded enamel paint in their original colors. Soft even studio light, subtle aged patina and very fine scratches. " + OHRANI },
  zad: { ime: "Žad", vir: "klasicen", seme: 888, denoise: 0.85, opis: "Polirana ploščica iz zelenega žada z zlatimi vložki",
    navodilo: "Make the background of this mahjong tile face polished translucent green nephrite jade with soft natural veins. The symbols stay in their original shapes and positions and become polished gold inlays, keeping a hint of their original colors. " + OHRANI },
  cloisonne: { ime: "Emajl", vir: "klasicen", seme: 1421, opis: "Kitajski emajl: zlate žičke, zapolnjene z barvnim steklenim emajlom",
    navodilo: "Turn this into the face of a mahjong tile made in Chinese cloisonne enamel. Every symbol is outlined with thin raised gold wires and filled with glossy enamel in its original color, on a smooth creamy white enamel background. " + OHRANI },
  porcelan: { ime: "Poslikan porcelan", vir: "klasicen", seme: 1368, opis: "Ročno poslikan modro-beli porcelan z leskom glazure",
    navodilo: "Turn this into the face of a mahjong tile made of glazed Ming dynasty blue and white porcelain. All symbols are hand painted with cobalt blue brushwork in several shades of blue on a glossy white glaze with a soft sheen and very fine crackle. " + OHRANI },
  intarzija: { ime: "Intarzija", vir: "klasicen", seme: 1650, denoise: 0.85, opis: "Temen palisander z vložki iz bisernice in medenine",
    navodilo: "Make the background of this mahjong tile face dark polished rosewood with fine grain. The symbols stay in their original shapes and positions and become inlays of iridescent mother of pearl tinted in their original colors. " + OHRANI },
};
