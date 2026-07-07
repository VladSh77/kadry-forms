// Kwestionariusz osobowy (załącznik nr 3 do Umowy zlecenia nr 1/WYC/2026) — pdfmake docDefinition
// dla wychowawcy CampScout (POLSKA). Struktura wg pakietu Daniela (hr-pack-fayna/web/doc_kwest.js).
const { header, h1, h2, fld, FOREST, INK, CAMPSCOUT } = require('./campscout_pdf');

// pusta podkreślona linia (odpowiednik bl() z pakietu Daniela)
function bl(n) {
  return { text: ' '.repeat(n || 40), decoration: 'underline', color: '#999' };
}
// wartość z A (pusty string dla null/undefined/true/false)
function a(A, key) {
  const v = A[key];
  if (v === undefined || v === null || v === true || v === false) return '';
  return String(v).trim();
}
// wypełnione pole (fld) lub pusta linia
function vline(A, key) {
  const v = a(A, key);
  return v ? fld(v) : bl();
}
function adresZam(A) {
  const parts = [];
  if (a(A, 'adres_zam_ulica')) parts.push(a(A, 'adres_zam_ulica'));
  const line2 = [a(A, 'adres_zam_kod'), a(A, 'adres_zam_miasto')].filter(Boolean).join(' ');
  if (line2) parts.push(line2);
  return parts.join(', ');
}

function docKwestPL(A) {
  A = A || {};
  const fullname = A.fullname || 'Imię i nazwisko';
  const dataMiejsce = [a(A, 'data_urodzenia'), a(A, 'miejsce_urodzenia')].filter(Boolean).join(' — ');
  const azf = adresZam(A);

  // [etykieta, treść wartości]
  const rows = [
    ['Imię i nazwisko', fld(fullname)],
    ['Nazwisko rodowe', vline(A, 'nazwisko_rodowe')],
    ['Imiona rodziców', vline(A, 'imiona_rodzicow')],
    ['Data i miejsce urodzenia', dataMiejsce ? fld(dataMiejsce) : bl()],
    ['Obywatelstwo', vline(A, 'obywatelstwo')],
    ['PESEL', vline(A, 'pesel')],
    ['Adres zameldowania', azf ? fld(azf) : bl()],
    ['Adres do korespondencji (jeśli inny)', vline(A, 'adres_koresp')],
    ['Telefon', vline(A, 'tel')],
    ['E-mail', vline(A, 'email')],
    ['Wykształcenie', vline(A, 'wyksztalcenie')],
    ['Zawód wykonywany', vline(A, 'zawod')],
    ['Oddział NFZ', vline(A, 'nfz')],
    ['Urząd Skarbowy', vline(A, 'us')],
    ['Numer rachunku bankowego', vline(A, 'iban')],
  ];

  const body = rows.map(([l, v]) => [
    { text: l, fillColor: '#f7f7f5', bold: true },
    v,
  ]);

  return {
    pageSize: 'A4',
    pageMargins: [40, 44, 40, 40],
    defaultStyle: { font: 'Roboto', fontSize: 9, color: INK },
    content: [
      ...header(),
      ...h1('KWESTIONARIUSZ OSOBOWY', 'Zleceniobiorca — załącznik nr 3 do umowy zlecenia'),
      {
        text: 'Prosimy wypełnić drukowanymi literami. Dane służą zawarciu i wykonaniu umowy zlecenia oraz realizacji obowiązków podatkowych i ubezpieczeniowych.',
        italics: true, fontSize: 7.6, color: '#666', margin: [0, 0, 0, 6],
      },
      {
        table: { widths: ['44%', '*'], body },
        layout: { hLineColor: () => '#c9c9c9', vLineColor: () => '#c9c9c9' },
        fontSize: 8.6,
      },
      {
        table: { widths: ['*'], body: [[{ stack: [
          { text: 'Oświadczenie o tożsamości i zgodności danych', bold: true, color: FOREST, margin: [0, 0, 0, 4] },
          { text: 'Oświadczam, że powyższe dane są zgodne ze stanem faktycznym oraz zobowiązuję się niezwłocznie informować Zleceniodawcę o ich zmianie.', fontSize: 8.2, margin: [0, 0, 0, 3] },
          { text: `Potwierdzam zapoznanie się z Klauzulą informacyjną RODO (załącznik nr 2). Dane zawarte w niniejszym kwestionariuszu są przetwarzane przez ${CAMPSCOUT.nazwa} na podstawie art. 6 ust. 1 lit. b i c RODO (zawarcie i wykonanie umowy oraz obowiązki prawne Zleceniodawcy) — zgoda nie jest wymagana.`, fontSize: 8.2 },
        ] }]] },
        layout: { hLineColor: () => '#d8d8d8', vLineColor: () => '#d8d8d8' },
        margin: [0, 8, 0, 0],
      },
      {
        columns: [
          { text: '______________________________\nMiejscowość i data', fontSize: 14, lineHeight: 1, color: '#444', alignment: 'center' },
        { text: '______________________________\nCzytelny podpis', fontSize: 14, lineHeight: 1, color: '#444', alignment: 'center' },
        ],
        margin: [0, 30, 0, 0], unbreakable: true,
      },
    ],
  };
}

module.exports = { docKwestPL };
