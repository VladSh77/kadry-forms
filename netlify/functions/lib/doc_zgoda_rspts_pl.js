// Oświadczenie-zgoda na weryfikację kandydata w rejestrach osób skazanych za przestępstwa
// przeciwko wolności seksualnej i nietykalności małoletnich (bezpieczeństwo dzieci) — załącznik
// do pakietu dokumentów instruktora CampScout (POLSKA). Administrator = CAMPSCOUT (JDG — Volodymyr Shevchenko).
const { header, h1, h2, fld, CAMPSCOUT, FOREST, INK } = require('./campscout_pdf');

const DATA_SPORZADZENIA = '07.07.2026';

function bl(w) {
  const n = Math.round((w || 160) / 5.6);
  return { text: ' '.repeat(n), decoration: 'underline', color: '#999' };
}
function vline(v, w) {
  return (v !== undefined && v !== null && String(v).trim() !== '') ? fld(String(v)) : bl(w);
}
function p(content, extra) {
  return Object.assign({ text: content, alignment: 'justify', margin: [0, 5, 0, 0], fontSize: 9 }, extra || {});
}

function docZgodaRSPTSPL(A) {
  A = A || {};
  const name = A.fullname || 'Imię i nazwisko';

  const content = [
    ...header(),
    ...h1(
      'OŚWIADCZENIE-ZGODA na weryfikację kandydata w rejestrach osób,',
      'które popełniły przestępstwa przeciwko wolności seksualnej i nietykalności małoletnich',
    ),

    p([
      `${CAMPSCOUT.nazwa}, jako organizator obozu dla dzieci, w celu zapewnienia bezpieczeństwa dzieci — uczestników obozu, `,
      'dokonuje weryfikacji kandydatów do kadry obozu (wychowawców, instruktorów, wolontariuszy) w dostępnych rejestrach osób ',
      'skazanych za przestępstwa przeciwko wolności seksualnej i nietykalności małoletnich (w Ukrainie i/lub w Rzeczypospolitej Polskiej — ',
      'wedle miejsca faktycznego prowadzenia obozu), przed dopuszczeniem kandydata do pracy z dziećmi.',
    ]),

    h2('Dane kandydata'),
    p(['Imię i nazwisko: ', fld(name)]),
    p(['Data urodzenia: ', vline(A.data_urodzenia, 130)]),
    p(['Dokument tożsamości: ', vline(A.dowod, 200)]),

    h2('Treść zgody'),
    p(['1. Ja, ', fld(name), ', świadomie i dobrowolnie udzielam ', { text: CAMPSCOUT.nazwa, bold: true }, ' zgody na dokonanie weryfikacji mojej osoby w rejestrach wskazanych powyżej, w celu potwierdzenia braku przeszkód do pracy z dziećmi.']),
    p('2. Wyrażam zgodę na przetwarzanie moich danych osobowych (w tym danych dotyczących ewentualnej karalności) wyłącznie w celu takiej weryfikacji, zgodnie z Rozporządzeniem UE 2016/679 (RODO) oraz przepisami o ochronie danych osobowych.'),
    p('3. Potwierdzam, że znany jest mi cel weryfikacji — zapewnienie bezpieczeństwa dzieci — i rozumiem, że jej wynik może mieć wpływ na decyzję o moim dopuszczeniu do pracy w obozie.'),
    p('4. Oświadczam, że podane przeze mnie dane są prawdziwe i zobowiązuję się niezwłocznie poinformować organizatora, jeżeli wobec mnie zostanie wszczęte postępowanie karne o przestępstwa przeciwko wolności seksualnej lub nietykalności małoletnich.'),
    p('5. Niniejsza zgoda obowiązuje przez okres przygotowań i trwania obozu i jest przechowywana przez organizatora zgodnie z terminami przewidzianymi dla dokumentacji kadrowej.'),

    {
      columns: [
        { text: ['Miejscowość i data: ', fld(DATA_SPORZADZENIA)], fontSize: 9 },
      ],
      margin: [0, 16, 0, 0],
    },

    {
      columns: [
        { stack: [
          { text: 'Kandydat', bold: true, fontSize: 8.5, color: FOREST },
          { text: ' ', fontSize: 8 },
          { text: '______________________________', margin: [0, 20, 0, 0], fontSize: 14, lineHeight: 1 },
          { text: '(podpis, imię i nazwisko)', fontSize: 8, color: '#444' },
        ] },
      ],
      margin: [0, 10, 0, 0], unbreakable: true,
    },
  ];

  return {
    pageSize: 'A4',
    pageMargins: [40, 44, 40, 40],
    defaultStyle: { font: 'Roboto', fontSize: 9, color: INK },
    content,
  };
}

module.exports = { docZgodaRSPTSPL };
