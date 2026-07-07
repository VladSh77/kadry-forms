// Oświadczenie zleceniobiorcy (ZUS/US + podatki) — załącznik nr 4 do Umowy zlecenia wychowawcy CampScout (POLSKA)
// Struktura dosłownie wg hr-pack-fayna/web/doc_zus.js :: docZUS() (Sekcja A-E), dostosowana do CampScout (JDG).
// FIKS: Sekcja D — KUP wyłącznie 20% (standardowe). Wariant 50% (§ 7 — prawa autorskie) USUNIĘTY,
// ponieważ umowa wychowawcy CampScout nie zawiera § 7 o przeniesieniu praw autorskich.
const { header, h1, h2: h2base, fld, box, cbLine, yn, FOREST, GOLD, INK } = require('./campscout_pdf');
function h2(t) { return { text: t, fontSize: 9.5, color: FOREST, bold: true, margin: [0, 6, 0, 2] }; }

const NR = '1/WYC/2026'; // nr Umowy zlecenia, do której niniejsze oświadczenie jest załącznikiem nr 4

// pusta podkreślona linia (odpowiednik `bl` z referencji)
function bl(w) {
  return { canvas: [{ type: 'line', x1: 0, y1: 9, x2: w || 160, y2: 9, lineWidth: 0.8, lineColor: '#999' }], margin: [0, 0, 0, 0] };
}
// wartość z A → fld(...) albo pusta linia
function vline(A, key, w) {
  const v = A[key];
  return (v !== undefined && v !== null && String(v).trim() !== '') ? fld(String(v).trim()) : bl(w);
}
// adres zamieszkania (ulica, kod miasto)
function adresZam(A) {
  const parts = [];
  if (A.adres_zam_ulica) parts.push(String(A.adres_zam_ulica).trim());
  const line2 = [A.adres_zam_kod, A.adres_zam_miasto].filter(Boolean).map(x => String(x).trim()).join(' ');
  if (line2) parts.push(line2);
  const reg = [A.adres_zam_woj, A.adres_zam_powiat_gmina].filter(Boolean).map(x => String(x).trim()).join(' / ');
  const base = parts.join(', ');
  return [base, reg].filter(Boolean).join(', ');
}

function lblCell(t) { return { text: t, fillColor: '#f7f7f5', bold: true }; }

function docZUSPL(A) {
  A = A || {};
  const nr = A.umowa_nr || NR;
  const fullname = A.fullname || 'Imię i nazwisko';

  // --- Sekcja A — Dane ---
  const adr = adresZam(A);
  const telEmail = [A.tel, A.email].filter(Boolean).map(x => String(x).trim()).join(' / ');
  const usNfz = [A.us, A.nfz].filter(Boolean).map(x => String(x).trim()).join(' / ');
  const aRows = [
    ['Imię i nazwisko', fld(fullname)],
    ['PESEL', vline(A, 'pesel', 150)],
    ['Data urodzenia', vline(A, 'data_urodzenia', 150)],
    ['NIP (jeśli dotyczy)', bl(150)],
    ['Dowód osobisty / paszport', vline(A, 'dowod', 150)],
    ['Adres zamieszkania', adr ? fld(adr) : bl(220)],
    ['Adres zameldowania (jeśli inny)', vline(A, 'adres_koresp', 220)],
    ['Telefon / e-mail', telEmail ? fld(telEmail) : bl(220)],
    ['Urząd Skarbowy / Oddział NFZ', usNfz ? fld(usNfz) : bl(220)],
    ['Numer rachunku bankowego', vline(A, 'iban', 220)],
  ];
  const aBody = aRows.map(([l, v]) => [lblCell(l), v]);

  // --- Sekcja B — Status ubezpieczeniowy (9 pozycji TAK/NIE) ---
  const bItems = [
    ['zus1', 'Jestem zatrudniony u innego pracodawcy z wynagrodzeniem co najmniej minimalnym'],
    ['zus2', 'Wykonuję inną umowę zlecenia objętą obowiązkowym ZUS'],
    ['zus3', 'Prowadzę działalność gospodarczą objętą obowiązkowym ZUS'],
    ['zus4', 'Jestem emerytem'],
    ['zus5', 'Jestem rencistą'],
    ['zus6', 'Jestem studentem/uczniem i nie ukończyłem 26 lat'],
    ['zus7', 'Jestem zarejestrowany jako bezrobotny'],
    ['zus8', 'Przebywam na urlopie macierzyńskim/wychowawczym lub mam świadczenie przedemerytalne'],
    ['zus9', 'Podlegam ubezpieczeniu w KRUS'],
  ];
  const bHead = [
    { text: '#', fillColor: '#f0f4f1', color: FOREST, bold: true },
    { text: 'Oświadczam, że:', fillColor: '#f0f4f1', color: FOREST, bold: true },
    { text: 'TAK / NIE', fillColor: '#f0f4f1', color: FOREST, bold: true },
  ];
  const bBody = [bHead].concat(bItems.map(([k, t], i) => [
    { text: String(i + 1), alignment: 'center' },
    { text: t },
    yn(A[k]),
  ]));

  return {
    pageSize: 'A4', pageMargins: [40, 44, 40, 40], defaultStyle: { font: 'Roboto', fontSize: 9, color: INK },
    content: [
      ...header(),
      ...h1('OŚWIADCZENIE ZLECENIOBIORCY (ZUS/US + PODATKI)', 'status ubezpieczeniowy, wnioski o ubezpieczenia i oświadczenia podatkowe'),
      { text: `Załącznik nr 4 do Umowy zlecenia nr ${nr}`, italics: true, fontSize: 7.6, color: '#666', margin: [0, 0, 0, 4] },

      h2('Sekcja A — Dane (drukowanymi literami)'),
      { table: { widths: [180, '*'], body: aBody }, layout: { hLineColor: () => '#c9c9c9', vLineColor: () => '#c9c9c9' }, fontSize: 8.6 },

      h2('Sekcja B — Status ubezpieczeniowy (zaznacz TAK/NIE)'),
      { table: { widths: [22, '*', 110], body: bBody }, layout: { hLineColor: () => '#c9c9c9', vLineColor: () => '#c9c9c9' }, fontSize: 8.6 },
      { text: 'W przypadku zaznaczenia NIE we wszystkich pozycjach niniejsze zlecenie stanowi jedyny tytuł do ubezpieczeń i podlega pełnemu oskładkowaniu. Przy „TAK” w poz. 1 należy potwierdzić, że podstawa z innego tytułu wynosi co najmniej minimalne wynagrodzenie; przy „TAK” w poz. 6 należy załączyć dokument potwierdzający status studenta.', italics: true, fontSize: 7.6, color: '#666', margin: [0, 4, 0, 2] },

      h2('Sekcja C — Wnioski o ubezpieczenia dobrowolne'),
      cbLine(!!A.dobr_emer_rent, 'Wnoszę o objęcie dobrowolnym ubezpieczeniem emerytalnym i rentowym z tytułu niniejszej umowy.'),
      cbLine(!!A.dobr_chor, 'Wnoszę o objęcie dobrowolnym ubezpieczeniem chorobowym (nie dotyczy studentów do 26 r.ż.).'),

      h2('Sekcja D — Oświadczenia podatkowe (PIT)'),
      {
        columns: [
          box(!!A.pit2),
          {
            width: '*', fontSize: 9, text: [
              'Wnoszę o stosowanie kwoty zmniejszającej zaliczkę na podatek (PIT-2): ',
            ],
          },
        ], columnGap: 3, margin: [0, 2, 0, 0],
      },
      {
        columns: [
          box(A.pit2_czesc === '1/12'), { text: '1/12', width: 'auto', fontSize: 8.6, margin: [2, 0, 8, 0] },
          box(A.pit2_czesc === '1/24'), { text: '1/24', width: 'auto', fontSize: 8.6, margin: [2, 0, 8, 0] },
          box(A.pit2_czesc === '1/36'), { text: '1/36.', width: 'auto', fontSize: 8.6, margin: [2, 0, 0, 0] },
        ], columnGap: 1, margin: [16, 1, 0, 2],
      },
      cbLine(!!A.bez_zaliczki, 'Wnoszę o niepobieranie zaliczki na podatek — przewiduję, że roczny dochód nie przekroczy kwoty wolnej (art. 41 ust. 1c ustawy o PIT).'),
      {
        columns: [
          { text: 'Koszty uzyskania przychodu: ', width: 'auto', fontSize: 9 },
          box(A.kup === '20'), { text: '20% (standardowe).', width: '*', fontSize: 8.6, margin: [2, 0, 0, 0] },
        ], columnGap: 1, margin: [0, 2, 0, 2],
      },
      {
        columns: [
          { text: 'Ulga dla młodych (do 26 r.ż., art. 21 ust. 1 pkt 148 ustawy o PIT): ', width: 'auto', fontSize: 9 },
          box(A.ulga26 === 'dotyczy'), { text: 'dotyczy', width: 'auto', fontSize: 8.6, margin: [2, 0, 8, 0] },
          box(A.ulga26 === 'nie_dotyczy'), { text: 'nie dotyczy.', width: 'auto', fontSize: 8.6, margin: [2, 0, 8, 0] },
          box(!!A.ulga26_niestosowac), { text: 'Wnoszę o niestosowanie ulgi.', width: '*', fontSize: 8.6, margin: [2, 0, 0, 0] },
        ], columnGap: 1, margin: [0, 2, 0, 2],
      },

      // Sekcja E і блок підпису — нерозривний блок (переливається РАЗОМ, не сиротою).
      {
        unbreakable: true,
        stack: [
          h2('Sekcja E — Oświadczenia końcowe'),
          { text: '1. Oświadczam, że powyższe dane są prawdziwe i zgodne ze stanem faktycznym; w razie podania nieprawdziwych danych ponoszę odpowiedzialność za szkodę wyrządzoną Zleceniodawcy.', fontSize: 8.2, margin: [0, 1, 0, 1] },
          { text: '2. Zobowiązuję się niezwłocznie informować Zleceniodawcę o każdej zmianie statusu mającej wpływ na ubezpieczenia lub rozliczenia podatkowe.', fontSize: 8.2, margin: [0, 1, 0, 1] },
          { text: '3. Zapoznałem się z klauzulą informacyjną RODO Zleceniodawcy (załącznik nr 2).', fontSize: 8.2, margin: [0, 1, 0, 1] },
          {
            columns: [
              { stack: [
                { text: ' ', margin: [0, 0, 0, 26] },
                { text: '______________________________', fontSize: 11, lineHeight: 1, color: '#444' },
                { text: 'Miejscowość i data', fontSize: 9, color: '#444', margin: [0, 3, 0, 0] },
              ], alignment: 'center' },
              { stack: [
                { text: ' ', margin: [0, 0, 0, 26] },
                { text: '______________________________', fontSize: 11, lineHeight: 1, color: '#444' },
                { text: 'Czytelny podpis', fontSize: 9, color: '#444', margin: [0, 3, 0, 0] },
              ], alignment: 'center' },
            ],
            margin: [0, 16, 0, 0],
          },
        ],
      },
    ],
  };
}

module.exports = { docZUSPL };
