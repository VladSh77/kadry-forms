// Upoważnienie do przetwarzania danych osobowych (art. 29 RODO)
// Załącznik nr 1 do Umowy zlecenia nr 1/WYC/2026 — dla wychowawcy CampScout (JDG — Volodymyr Shevchenko).
// Struktura §1–§6 zgodna ze wzorem hr-pack-fayna/web/doc_upowaznienie.js, dostosowana do CampScout i danych dzieci (art. 9 RODO).
const { header, h1: h1base, h2: h2base, fld, CAMPSCOUT, FOREST, GOLD, INK } = require('./campscout_pdf');
function h1(t, sub) { return [ { text: t, fontSize: 13, color: FOREST, bold: true, margin: [0, 2, 0, 1] }, { text: sub, fontSize: 8.5, color: GOLD, bold: true, margin: [0, 0, 0, 5] } ]; }
function h2(t) { return { text: t, fontSize: 9.5, color: FOREST, bold: true, margin: [0, 6, 0, 2] }; }

const NR_UMOWY = '1/WYC/2026';
// data sporządzenia — FIKSOWANA (nie new Date())
const DATA_SPORZADZENIA = '07.07.2026';

// pusta linia do uzupełnienia (podkreślona)
function bl(w) {
  const n = Math.round((w || 180) / 5.8);
  return { text: ' '.repeat(n), decoration: 'underline', color: '#999' };
}

// wypełnione pole (podkreślone) lub pusta linia
function vline(v, w) {
  return (v !== undefined && v !== null && String(v).trim() !== '') ? fld(String(v)) : bl(w);
}

function p(content, extra) {
  return Object.assign({ text: content, alignment: 'justify', margin: [0, 2, 0, 0] }, extra || {});
}

function docUpowaznieniePL(A) {
  A = A || {};
  const nr = A.umowa_nr || NR_UMOWY;
  const nameInst = A.fullname || 'Imię i nazwisko';

  const content = [
    ...header(),
    ...h1('UPOWAŻNIENIE DO PRZETWARZANIA DANYCH OSOBOWYCH',
      'art. 29 RODO — załącznik nr 1 do Umowy zlecenia'),

    { text: `Załącznik nr 1 do Umowy zlecenia nr ${nr}`, italics: true, fontSize: 7.6, color: '#666', margin: [0, 0, 0, 4] },
    p(['Sporządzone w Ostrowie Wielkopolskim dnia ', fld(DATA_SPORZADZENIA), '.']),
    p([
      { text: CAMPSCOUT.nazwa, bold: true },
      `, ${CAMPSCOUT.adres}, NIP ${CAMPSCOUT.nip}, REGON ${CAMPSCOUT.regon}, ROT ${CAMPSCOUT.rot}, `,
      `reprezentowany przez ${CAMPSCOUT.reprezentant} — właściciela (organizatora), jako administrator danych osobowych (dalej „Administrator”), `,
      'niniejszym upoważnia ', fld(nameInst), ', PESEL ', vline(A.pesel, 150),
      ' (dalej „Osoba upoważniona”), będącą Zleceniobiorcą z ww. Umowy zlecenia, do przetwarzania danych osobowych ',
      { text: 'w imieniu i na polecenie Administratora', bold: true },
      ', w zakresie i na zasadach określonych poniżej (art. 29 RODO).',
    ]),

    h2('§ 1. Podstawa i charakter upoważnienia'),
    p(`1. Osoba upoważniona przetwarza dane osobowe wyłącznie w ramach wykonywania Umowy zlecenia nr ${nr}, pod zwierzchnictwem i zgodnie z udokumentowanymi poleceniami Administratora; nie jest odrębnym administratorem ani podmiotem przetwarzającym.`),
    p('2. Przetwarzanie odbywa się w dokumentacji obozowej (m.in. karty kwalifikacyjne uczestników, listy, ewidencja) oraz w narzędziach i na nośnikach udostępnionych lub wskazanych przez Administratora.'),

    h2('§ 2. Zakres danych i kategorie osób'),
    p('1. Rodzaj danych: dane identyfikacyjne i kontaktowe dzieci i młodzieży — uczestników obozów CampScout (imię, nazwisko, data urodzenia, adres, PESEL) oraz ich rodziców/opiekunów prawnych (imię, nazwisko, telefon, e-mail, adres), a także dane dotyczące przebiegu obozu. W zakresie niezbędnym do zapewnienia bezpieczeństwa i opieki — dane dotyczące stanu zdrowia uczestników (choroby, alergie, przyjmowane leki, zalecenia lekarskie), stanowiące dane szczególnej kategorii w rozumieniu art. 9 RODO.'),
    p('2. Kategorie osób: dzieci i młodzież — uczestnicy obozów CampScout, ich rodzice/opiekunowie prawni, a w razie potrzeby inni pracownicy i współpracownicy Administratora.'),
    p([
      { text: 'Minimalizacja (art. 5 ust. 1 lit. c RODO): ', bold: true },
      'Osoba upoważniona przetwarza wyłącznie dane niezbędne do wykonywania obowiązków wychowawcy/instruktora na obozie. Dostęp do danych szczególnej kategorii (art. 9 RODO — stan zdrowia dzieci) przysługuje wyłącznie w zakresie ściśle niezbędnym do zapewnienia bezpieczeństwa i opieki nad uczestnikami.',
    ]),

    h2('§ 3. Obowiązki Osoby upoważnionej'),
    p('1. Przetwarza dane wyłącznie na udokumentowane polecenie i zgodnie z instrukcjami Administratora oraz kierownika obozu.'),
    p('2. Zachowuje w tajemnicy dane oraz sposoby ich zabezpieczenia — w czasie trwania Umowy zlecenia i bezterminowo po jej ustaniu.'),
    p('3. Stosuje środki bezpieczeństwa wskazane przez Administratora (art. 32 RODO); wobec danych szczególnej kategorii (stan zdrowia dzieci) — z najwyższą starannością, w szczególności nie pozostawia dokumentacji bez nadzoru i chroni ją przed dostępem osób nieuprawnionych.'),
    p('4. Nie kopiuje, nie fotografuje, nie eksportuje ani nie przechowuje danych poza dokumentacją i systemami udostępnionymi przez Administratora i nie udostępnia ich osobom trzecim.'),
    p('5. Niezwłocznie, nie później niż w ciągu 24 godzin, zawiadamia Administratora (kierownika obozu) o każdym podejrzeniu lub stwierdzeniu naruszenia ochrony danych.'),
    p('6. Pomaga Administratorowi w realizacji praw osób, których dane dotyczą (rodziców/opiekunów), oraz w wykonaniu obowiązków z art. 32–36 RODO.'),

    h2('§ 4. Dane podmiotów obsługiwanych przez Administratora'),
    p('W zakresie, w jakim Administrator przetwarza dane jako podmiot przetwarzający na rzecz osób trzecich (np. innych organizatorów lub partnerów CampScout), Osoba upoważniona przetwarza te dane wyłącznie w granicach poleceń Administratora oraz zgody i poleceń administratorów tych danych.'),

    h2('§ 5. Czas obowiązywania i ustanie'),
    p(`1. Upoważnienie obowiązuje przez czas trwania Umowy zlecenia nr ${nr} i wygasa wraz z nią lub z chwilą jego odwołania przez Administratora.`),
    p('2. Z chwilą ustania Osoba upoważniona zaprzestaje przetwarzania, zwraca lub trwale usuwa nośniki i dokumentację zawierającą dane i nie zachowuje ich kopii, chyba że przepisy nakazują dalsze przechowywanie.'),

    // §6 і блок підпису — один нерозривний блок: якщо не влазить, переливається
    // РАЗОМ (не сиротою) на наступну сторінку, з нормальним місцем під підпис.
    {
      unbreakable: true,
      stack: [
        h2('§ 6. Odpowiedzialność'),
        p(`Do naruszenia obowiązków wynikających z niniejszego upoważnienia stosuje się odpowiednio postanowienia § 6 Umowy zlecenia nr ${nr} (poufność). Upoważnienie sporządzono w dwóch egzemplarzach, po jednym dla każdej ze Stron.`),
        {
          columns: [
            { stack: [
              { text: ' ', margin: [0, 0, 0, 26] },
              { text: '______________________________', fontSize: 11, lineHeight: 1, color: '#444' },
              { text: 'Administrator (udzielający upoważnienia)', fontSize: 8.5, color: FOREST, bold: true, margin: [0, 3, 0, 0] },
              { text: CAMPSCOUT.reprezentant, fontSize: 8, color: '#444' },
            ], alignment: 'center' },
            { stack: [
              { text: ' ', margin: [0, 0, 0, 26] },
              { text: '______________________________', fontSize: 11, lineHeight: 1, color: '#444' },
              { text: 'Osoba upoważniona (potwierdzam przyjęcie)', fontSize: 8.5, color: FOREST, bold: true, margin: [0, 3, 0, 0] },
              { text: nameInst, fontSize: 8, color: '#444' },
            ], alignment: 'center' },
          ],
          margin: [0, 16, 0, 0],
        },
      ],
    },
  ];

  return {
    pageSize: 'A4',
    pageMargins: [40, 44, 40, 40],
    defaultStyle: { font: 'Roboto', fontSize: 9, color: INK },
    content,
  };
}

module.exports = { docUpowaznieniePL };
