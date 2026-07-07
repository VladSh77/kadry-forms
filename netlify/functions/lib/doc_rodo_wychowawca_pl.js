// Klauzula informacyjna RODO (art. 13) — załącznik nr 2 do umowy wychowawcy CampScout (POLSKA)
// Administrator = CAMPSCOUT (JDG — Volodymyr Shevchenko), BEZ KRS (JDG nie ma KRS)
const { header, h1, h2, fld, cbLine, box, CAMPSCOUT, FOREST, GOLD, INK } = require('./campscout_pdf');

function docRODOPL(A) {
  A = A || {};

  const nameInst = A.fullname || 'Imię i nazwisko';

  const rows = [
    ['Administrator', `${CAMPSCOUT.nazwa}, ${CAMPSCOUT.adres}, NIP ${CAMPSCOUT.nip}, REGON ${CAMPSCOUT.regon}, ROT ${CAMPSCOUT.rot}. Kontakt: ${CAMPSCOUT.email}`],
    ['Cele i podstawy', 'Zawarcie i wykonanie umowy zlecenia (art. 6 ust. 1 lit. b); obowiązki podatkowe i ubezpieczeniowe (lit. c); ustalenie, dochodzenie lub obrona przed roszczeniami – na podstawie prawnie uzasadnionego interesu Administratora (art. 6 ust. 1 lit. f RODO)'],
    ['Okres przechowywania', 'Umowa – 6 lat; dokumentacja podatkowa – 5 lat; dokumentacja ZUS – zgodnie z przepisami; roszczenia – do upływu przedawnienia'],
    ['Odbiorcy danych', 'US, ZUS, NFZ, biuro rachunkowe, dostawcy IT (na podstawie umów powierzenia)'],
    ['Prawa', 'Dostęp, sprostowanie, usunięcie, ograniczenie, przenoszenie, sprzeciw, a w zakresie danych przetwarzanych na podstawie zgody — jej wycofanie w dowolnym momencie'],
    ['Skarga', 'Prezes Urzędu Ochrony Danych Osobowych, ul. Stawki 2, 00-193 Warszawa'],
    ['Profilowanie', 'Dane nie są wykorzystywane do zautomatyzowanego podejmowania decyzji ani profilowania'],
    ['Przekazywanie poza EOG', 'Dane nie są przekazywane poza EOG bez wymaganych zabezpieczeń'],
  ];

  const body = [[
    { text: 'Element', fillColor: '#f0f4f1', color: FOREST, bold: true },
    { text: 'Treść', fillColor: '#f0f4f1', color: FOREST, bold: true },
  ]].concat(rows.map(([l, t]) => [{ text: l, fillColor: '#f7f7f5', bold: true }, { text: t }]));

  const content = [
    ...header(),
    ...h1('KLAUZULA INFORMACYJNA RODO', 'art. 13 RODO — przetwarzanie danych zleceniobiorcy (załącznik nr 2)'),

    { text: ['Imię i nazwisko: ', fld(nameInst)], margin: [0, 0, 0, 4] },

    h2('Klauzula informacyjna (art. 13 RODO)'),
    { table: { widths: [150, '*'], body }, layout: { hLineColor: () => '#c9c9c9', vLineColor: () => '#c9c9c9' }, fontSize: 8.6 },

    { text: 'Dane niezbędne do zawarcia i wykonania umowy oraz realizacji obowiązków prawnych są przetwarzane na podstawie art. 6 ust. 1 lit. b i c RODO — zgoda nie jest wymagana i nie warunkuje zawarcia umowy.', fontSize: 8.2, margin: [0, 6, 0, 2] },
    { text: `Pełna informacja: ${CAMPSCOUT.email}`, fontSize: 8.2, margin: [0, 0, 0, 6] },

    {
      table: {
        widths: ['*'],
        body: [[{
          stack: [
            { text: 'Zgody dobrowolne', bold: true, color: FOREST, margin: [0, 0, 0, 4] },
            cbLine(!!A.zgoda_marketing, '(dobrowolnie) Wyrażam zgodę na przetwarzanie moich danych w celach marketingowych — informowania o nowych ofertach i współpracy z CampScout (art. 6 ust. 1 lit. a RODO).'),
            cbLine(!!A.zgoda_wizerunek, '(dobrowolnie) Wyrażam zgodę na utrwalanie i wykorzystanie mojego wizerunku (zdjęcia/nagrania zespołowe) do celów wewnętrznych i promocyjnych CampScout (art. 6 ust. 1 lit. a RODO).'),
            { text: 'Zgody są dobrowolne, można je wycofać w każdym czasie, a ich brak nie wpływa na zawarcie ani ważność umowy.', italics: true, fontSize: 7.6, color: '#666', margin: [0, 3, 0, 0] },
          ],
        }]],
      },
      layout: { hLineColor: () => '#d8d8d8', vLineColor: () => '#d8d8d8' },
      margin: [0, 2, 0, 0],
    },

    {
      columns: [
        { text: '______________________________\nMiejscowość i data', fontSize: 14, lineHeight: 1, color: '#444', alignment: 'center' },
        { text: '______________________________\nCzytelny podpis', fontSize: 14, lineHeight: 1, color: '#444', alignment: 'center' },
      ],
      margin: [0, 30, 0, 0], unbreakable: true,
    },
  ];

  return {
    pageSize: 'A4',
    pageMargins: [40, 44, 40, 40],
    defaultStyle: { font: 'Roboto', fontSize: 9, color: INK },
    content,
  };
}

module.exports = { docRODOPL };
