// Umowa zlecenia (instruktor) nr 1/WYC/2026 — pdfmake docDefinition, CampScout (POLSKA)
// Wynagrodzenie: 220 zł/dzień, nie niżej minimalnej stawki godzinowej (31,40 zł/h); ewidencja godzin (dziennik zajęć)
const { fld, header, h1, h2, CAMPSCOUT, FOREST, INK } = require('./campscout_pdf');

// data zawarcia umowy — FIKSOWANA (nie new Date()!)
const DATA_ZAWARCIA = '07.07.2026';
// domyślny okres obozu, jeśli formularz nie poda dat
const DEFAULT_DATA_OD = '2026-07-08';
const DEFAULT_DATA_DO = '2026-07-21';

const TERMS = {
  nr: '1/WYC/2026',
  stawka_godz: '31,40', // zł/godzinę — minimalna stawka godzinowa 2026 (Dz.U. 2025 poz. 1242)
  okres_wypow: '7',     // dni
  okres_obowiazu: '12', // m-cy po umowie (non-compete)
};

// pusta linia do podpisu/uzupełnienia
function bl(w) {
  const n = Math.round((w || 180) / 5.8);
  return { text: ' '.repeat(n), decoration: 'underline', color: '#999' };
}

// wypełnione pole lub pusta linia
function vline(v, w) {
  return (v !== undefined && v !== null && String(v).trim() !== '') ? fld(String(v)) : bl(w);
}

function adresZam(A) {
  const parts = [];
  if (A.adres_zam_ulica) parts.push(String(A.adres_zam_ulica).trim());
  const line2 = [A.adres_zam_kod, A.adres_zam_miasto].filter(Boolean).map(s => String(s).trim()).join(' ');
  if (line2) parts.push(line2);
  return parts.join(', ');
}

function p(content, extra) {
  return Object.assign({ text: content, alignment: 'justify', margin: [0, 4, 0, 0] }, extra || {});
}

// DD.MM.YYYY z wiodącym zerem
function fmtPL(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}.${mm}.${d.getFullYear()}`;
}

function docUmowaWychowawcaPL(A) {
  A = A || {};

  const nameInst = A.fullname || 'Imię i nazwisko';
  const zam = adresZam(A);
  const zamNode = zam ? fld(zam) : bl(220);

  // Daty obozu — z formularza, w razie braku domyślny termin 08–21.07.2026
  const data_od = fmtPL(A.data_od || DEFAULT_DATA_OD);
  const data_do = fmtPL(A.data_do || DEFAULT_DATA_DO);

  const content = [
    ...header(),
    ...h1('UMOWA ZLECENIA nr ' + (A.umowa_nr || TERMS.nr), 'instruktor prowadzący zajęcia na wypoczynku dzieci i młodzieży (art. 734 i nast. Kodeksu cywilnego)'),

    p(['zawarta w Ostrowie Wielkopolskim w dniu ', fld(DATA_ZAWARCIA), ' pomiędzy:']),
    p([
      { text: CAMPSCOUT.reprezentant, bold: true },
      `, prowadzącym jednoosobową działalność gospodarczą pod firmą „${CAMPSCOUT.nazwa}", wpisanym do CEIDG, ${CAMPSCOUT.adres}, NIP ${CAMPSCOUT.nip}, REGON ${CAMPSCOUT.regon}, ROT ${CAMPSCOUT.rot}, zwanym dalej „Zleceniodawcą",`,
    ]),
    p('a'),
    p([
      'Panem/Panią ', fld(nameInst), ', zamieszkałym/zamieszkałą ', zamNode,
      ', legitymującym/legitymującą się dokumentem tożsamości ', vline(A.dowod, 150),
      ', PESEL ', vline(A.pesel, 150),
      ', zwanym/zwaną dalej „Zleceniobiorcą", zwanymi dalej łącznie „Stronami".',
    ]),

    h2('§ 1. Przedmiot umowy'),
    p('1. Zleceniodawca zleca, a Zleceniobiorca zobowiązuje się do osobistego wykonywania czynności instruktorskich, polegających na przygotowaniu i prowadzeniu zajęć programowych (w szczególności animacyjnych, sportowo-rekreacyjnych i edukacyjnych) dla uczestników wypoczynku organizowanego przez Zleceniodawcę pod marką CampScout, zgodnie z ustalonym harmonogramem zajęć (programem obozu, m.in. programem «Mafia»).'),
    p('2. Zakres czynności obejmuje w szczególności: przygotowanie i prowadzenie zajęć zgodnie z harmonogramem, dbałość o bezpieczeństwo uczestników w czasie prowadzonych zajęć, współpracę z pozostałą kadrą obozu oraz bieżącą dokumentację i raportowanie do kierownika obozu, zgodnie z wewnętrznymi standardami CampScout.'),
    p('3. Zleceniobiorca zobowiązuje się do osobistego wykonania czynności z zachowaniem należytej staranności wymaganej od profesjonalisty (art. 355 § 2 Kodeksu cywilnego), z poszanowaniem dobrego imienia Zleceniodawcy oraz zgodnie z wewnętrznymi standardami bezpieczeństwa marki CampScout.'),
    p('4. Powierzenie wykonania zlecenia osobie trzeciej (substytucja) jest wyłączone (art. 738 § 1 Kodeksu cywilnego).'),
    p('5. Zlecenie ma charakter starannego działania; Zleceniobiorca nie gwarantuje osiągnięcia określonego rezultatu.'),

    h2('§ 2. Sposób wykonywania zlecenia i charakter umowy'),
    p('1. Zleceniobiorca samodzielnie dobiera metody prowadzenia zajęć oraz organizuje sposób ich wykonania, z zachowaniem należytej staranności, standardów bezpieczeństwa CampScout i obowiązujących przepisów prawa.'),
    p('2. Zajęcia realizowane są w godzinach wynikających z harmonogramu zajęć uzgodnionego przez Strony. Zleceniobiorca nie pozostaje w całodobowej dyspozycji Zleceniodawcy i zachowuje czas wolny od czynności objętych zleceniem. O kwalifikacji prawnej stosunku łączącego Strony decydują rzeczywiste warunki wykonywania czynności (art. 22 § 1¹ Kodeksu pracy); niniejsza umowa nie zastępuje umowy o pracę i nie może być zawarta w warunkach charakterystycznych dla stosunku pracy.'),

    h2('§ 3. Czas trwania umowy'),
    p(['1. Niniejszą umowę zawiera się na czas określony od dnia ', fld(data_od), ' do dnia ', fld(data_do), '.']),
    p('2. Po upływie powyższego okresu Strony mogą zawrzeć kolejną umowę.'),

    h2('§ 4. Wynagrodzenie'),
    p(['1. Zleceniobiorcy przysługuje wynagrodzenie w wysokości ', fld('220 zł'), ' brutto za dzień wykonywania zlecenia (prowadzenia zajęć programowych).']),
    p('2. Niezależnie od sposobu ustalenia wynagrodzenia, wynagrodzenie Zleceniobiorcy za każdą godzinę wykonania zlecenia nie będzie niższe niż minimalna stawka godzinowa ustalona zgodnie z ustawą z dnia 10 października 2002 r. o minimalnym wynagrodzeniu za pracę, obowiązująca w okresie rozliczeniowym (informacyjnie, wg stanu na dzień zawarcia umowy — 31,40 zł brutto/godz.). W razie gdyby wynagrodzenie dzienne nie pokrywało tej kwoty, Zleceniodawca dokona wyrównania w terminie wypłaty.'),
    p('3. Zleceniobiorca prowadzi i przekazuje ewidencję liczby godzin wykonania zlecenia w formie dokumentowej (m.in. w postaci dziennika prowadzonych zajęć) przed terminem wypłaty. W razie nieprzekazania ewidencji przyjmuje się liczbę godzin wynikającą z harmonogramu programu obozu, przy czym Zleceniobiorca może obalić to domniemanie własnymi dowodami; przyjęta liczba godzin nie może skutkować wynagrodzeniem niższym niż minimalna stawka godzinowa. Ewidencja przechowywana jest przez 3 lata od dnia wymagalności wynagrodzenia.'),
    p('4. Wynagrodzenie płatne jest w terminie 14 dni od zakończenia turnusu, przelewem na rachunek bankowy wskazany przez Zleceniobiorcę. Zleceniodawca, jako płatnik, odprowadza należne składki i zaliczki zgodnie z przepisami, na podstawie Oświadczenia zleceniobiorcy (załącznik nr 4).'),

    h2('§ 5. Obowiązki Zleceniodawcy'),
    p('Zleceniodawca zobowiązuje się do: terminowej zapłaty wynagrodzenia, zapewnienia bezpiecznych warunków wykonywania zajęć oraz niezbędnego wyposażenia, a także udzielenia informacji dotyczących programu i zasad bezpieczeństwa.'),

    h2('§ 6. Poufność, zakaz konkurencji i ochrona danych'),
    p('1. Zleceniobiorca zobowiązuje się do zachowania w tajemnicy wszelkich informacji oraz danych osobowych Zleceniodawcy, jego klientów, a także uczestników wypoczynku i ich opiekunów, do których uzyska dostęp w związku z wykonywaniem umowy. Obowiązek ten szczególnie dotyczy danych dzieci i młodzieży oraz informacji o stanie ich zdrowia (dane szczególnej kategorii w rozumieniu art. 9 RODO). Obowiązek poufności obowiązuje bezterminowo po ustaniu umowy.'),
    p(`2. W trakcie obowiązywania umowy oraz przez ${TERMS.okres_obowiazu} miesięcy po jej ustaniu Zleceniobiorca nie będzie organizował ani uczestniczył w organizacji konkurencyjnych obozów lub kolonii dla dzieci i młodzieży, kierowanych do klientów CampScout, z którymi zapoznał się wyłącznie w związku z wykonywaniem niniejszej umowy, ani nie będzie wykorzystywał uzyskanej w związku z umową bazy klientów.`),
    p('3. Zasady przetwarzania danych osobowych reguluje Upoważnienie do przetwarzania danych osobowych (art. 29 RODO, załącznik nr 1) oraz Klauzula informacyjna RODO (załącznik nr 2).'),

    h2('§ 7. Rozwiązanie umowy'),
    p(['1. Każdej ze Stron przysługuje prawo wypowiedzenia umowy z zachowaniem ', fld(TERMS.okres_wypow), '-dniowego okresu wypowiedzenia.']),
    p('2. Z ważnych powodów każda ze Stron może wypowiedzieć umowę ze skutkiem natychmiastowym (art. 746 § 3 Kodeksu cywilnego); prawa tego nie można skutecznie wyłączyć.'),
    p('3. W razie wypowiedzenia Zleceniobiorcy przysługuje wynagrodzenie odpowiadające faktycznie wykonanym godzinom do dnia rozwiązania umowy.'),
    p('4. W razie wypowiedzenia umowy przez Zleceniobiorcę bez ważnego powodu Zleceniodawca może dochodzić naprawienia szkody powstałej wskutek konieczności zapewnienia zastępstwa (art. 746 § 2 Kodeksu cywilnego).'),
    p('5. Wypowiedzenie wymaga formy dokumentowej.'),

    h2('§ 8. Postanowienia końcowe'),
    p('1. W sprawach nieuregulowanych stosuje się przepisy Kodeksu cywilnego, w szczególności art. 734 i nast.'),
    p('2. Zmiany umowy wymagają formy pisemnej pod rygorem nieważności.'),
    p('3. Spory rozstrzyga sąd właściwy dla miejsca wykonywania działalności gospodarczej Zleceniodawcy.'),
    p('4. Umowę sporządzono w dwóch jednobrzmiących egzemplarzach, po jednym dla każdej ze Stron.'),
    p('5. Załączniki: nr 1 – Upoważnienie do przetwarzania danych osobowych (art. 29 RODO); nr 2 – Klauzula informacyjna RODO (art. 13 RODO); nr 3 – Kwestionariusz osobowy; nr 4 – Oświadczenie ZUS/US i podatki.'),

    {
      columns: [
        { stack: [
          { text: ' ', margin: [0, 0, 0, 26] },
          { text: '______________________________', fontSize: 11, lineHeight: 1, color: '#444' },
          { text: 'Zleceniodawca', fontSize: 8.5, color: FOREST, bold: true, margin: [0, 3, 0, 0] },
          { text: CAMPSCOUT.reprezentant, fontSize: 8, color: '#444' },
        ], alignment: 'center' },
        { stack: [
          { text: ' ', margin: [0, 0, 0, 26] },
          { text: '______________________________', fontSize: 11, lineHeight: 1, color: '#444' },
          { text: 'Zleceniobiorca', fontSize: 8.5, color: FOREST, bold: true, margin: [0, 3, 0, 0] },
          { text: nameInst, fontSize: 8, color: '#444' },
        ], alignment: 'center' },
      ],
      margin: [0, 16, 0, 0],
      unbreakable: true,
    },
  ];

  return {
    pageSize: 'A4',
    pageMargins: [40, 44, 40, 40],
    defaultStyle: { font: 'Roboto', fontSize: 9, color: INK },
    content,
  };
}

module.exports = { docUmowaWychowawcaPL };
