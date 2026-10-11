# Mahjong

Klasičen Mahjong pasjansa, narejen po meri: mirno, brez reklam in nakupov, brez prijave, deluje brez interneta.

- 144 ploščic v klasičnem kitajskem slogu, 136 postavitev in potovanje po svetu (23 krajev, 92 stopenj)
- vsaka igra je rešljiva; namigi, mešanje in ponovitev iste postavitve
- igra se sproti shranjuje in se ob odprtju nadaljuje tam, kjer si ostal
- ozadja se menjajo z letnimi časi in prazniki

## Razvoj

```bash
npm install
npm run dev
```

Orodja v mapi `orodja/`: `slike-vse.mjs` ustvari ozadja (Hugging Face, FLUX), `glifi.py` izvleče kitajske znake iz pisave LXGW WenKai TC (SIL OFL 1.1), `preveri-postavitve.ts` preveri vse postavitve, `preizkus.ts` igro samodejno odigra.

Ime in rojstni dan se nastavita s povezavo `?ime=…&rd=dan.mesec` ali v nastavitvah in se shranita samo v brskalnik.
