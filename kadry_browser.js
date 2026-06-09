/* kadry_browser.js — авто-зібрано з Node-модулів (pdfmake у браузері).
   Експонує window.KADRY = { docUmowa, docKwestionariusz, docRODO, docZUS, docUpowaznienie, genAll }.
   Потребує глобального pdfmake (pdfmake.min.js + vfs_fonts.js). */
(function(){
// Спільний модуль pdfmake для HR-пакету FAYNA (вертикальний зріз: Klauzula RODO)
const FOREST='#285642', GOLD='#C9972B', INK='#1a1a1a';

// вектор-чекбокс: порожній квадрат або зелений із галкою
function box(checked){
  const c=[{type:'rect',x:0,y:1.5,w:8.5,h:8.5,lineWidth:.8,lineColor:checked?FOREST:'#888',
            ...(checked?{color:FOREST}:{})}];
  if(checked){ // біла галка
    c.push({type:'line',x1:1.8,y1:6,x2:3.6,y2:8,lineWidth:1.1,lineColor:'#fff'});
    c.push({type:'line',x1:3.6,y1:8,x2:7,y2:3,lineWidth:1.1,lineColor:'#fff'});
  }
  return {canvas:c, width:13};
}
// чекбокс + підпис (рядок)
function cbLine(checked,text){ return {columns:[box(checked),{text,width:'*',fontSize:9}],columnGap:3,margin:[0,2,0,2]}; }
// TAK/NIE для комірки таблиці
function yn(val){ return {columns:[box(val==='TAK'),{text:'TAK',width:'auto',fontSize:8.6,margin:[2,0,8,0]},
                                   box(val==='NIE'),{text:'NIE',width:'auto',fontSize:8.6,margin:[2,0,0,0]}],columnGap:1}; }
function fld(v){ return {text:String(v),bold:true,color:FOREST,decoration:'underline'}; }

function header(){ return [
  {text:'FAYNA DIGITAL sp. z o.o.',bold:true,fontSize:12,color:FOREST},
  {text:'ul. Kaliska 45, 63-400 Ostrów Wielkopolski · KRS 0001211419 · NIP 6222868819 · REGON 543493338',fontSize:7.2,color:'#555'},
  {text:'reprezentowana przez Irynę Shevchenko – Prezesa Zarządu · hallo@fayna.agency',fontSize:7.2,color:'#555'},
  {canvas:[{type:'line',x1:0,y1:2,x2:515,y2:2,lineWidth:2,lineColor:GOLD}],margin:[0,4,0,10]},
];}
function h1(t,sub){ return [{text:t,fontSize:13,color:FOREST,bold:true,margin:[0,2,0,1]},
  {text:sub,fontSize:8.5,color:GOLD,bold:true,margin:[0,0,0,10]}]; }
function h2(t){ return {text:t,fontSize:9.5,color:FOREST,bold:true,margin:[0,9,0,3]}; }

// === Klauzula RODO (art.13) ===
function docRODO(A){
  A=A||{};
  const rows=[
    ['Administrator','FAYNA DIGITAL sp. z o.o., ul. Kaliska 45, 63-400 Ostrów Wielkopolski, KRS 0001211419, NIP 6222868819. Kontakt: hallo@fayna.agency'],
    ['Cele i podstawy','Zawarcie i wykonanie umowy zlecenia (art. 6 ust. 1 lit. b); obowiązki podatkowe i ubezpieczeniowe (lit. c); ustalenie i dochodzenie roszczeń (lit. f)'],
    ['Okres przechowywania','Umowa – 6 lat; dokumentacja podatkowa – 5 lat; dokumentacja ZUS – zgodnie z przepisami; roszczenia – do upływu przedawnienia'],
    ['Odbiorcy danych','US, ZUS, NFZ, biuro rachunkowe, dostawcy IT (na podstawie umów powierzenia)'],
    ['Prawa','Dostęp, sprostowanie, usunięcie, ograniczenie, przenoszenie, sprzeciw, a w zakresie danych przetwarzanych na podstawie zgody — jej wycofanie w dowolnym momencie'],
    ['Skarga','Prezes Urzędu Ochrony Danych Osobowych, ul. Stawki 2, 00-193 Warszawa'],
    ['Profilowanie','Dane nie są wykorzystywane do zautomatyzowanego podejmowania decyzji ani profilowania'],
    ['Przekazywanie poza EOG','Dane nie są przekazywane poza EOG bez wymaganych zabezpieczeń'],
  ];
  const body=[[{text:'Element',fillColor:'#f0f4f1',color:FOREST,bold:true},{text:'Treść',fillColor:'#f0f4f1',color:FOREST,bold:true}]]
    .concat(rows.map(([l,t])=>[{text:l,fillColor:'#f7f7f5',bold:true},{text:t}]));
  return {
    pageSize:'A4', pageMargins:[40,44,40,40], defaultStyle:{font:'Roboto',fontSize:9,color:INK},
    content:[
      ...header(), ...h1('KLAUZULA INFORMACYJNA RODO','art. 13 RODO — przetwarzanie danych zleceniobiorcy'),
      {text:['Imię i nazwisko: ', fld(A.fullname||'Daniel Indryszczak')], margin:[0,0,0,4]},
      h2('Klauzula informacyjna (art. 13 RODO)'),
      {table:{widths:[150,'*'],body},layout:{hLineColor:()=>'#c9c9c9',vLineColor:()=>'#c9c9c9'},fontSize:8.6},
      {text:'Dane niezbędne do zawarcia i wykonania umowy oraz realizacji obowiązków prawnych są przetwarzane na podstawie art. 6 ust. 1 lit. b i c RODO — zgoda nie jest wymagana i nie warunkuje zawarcia umowy.',fontSize:8.2,margin:[0,6,0,2]},
      {text:'Pełna Polityka Prywatności: www.fayna.agency/privacy-policy',fontSize:8.2,margin:[0,0,0,6]},
      {table:{widths:['*'],body:[[{stack:[
        {text:'Zgody dobrowolne',bold:true,color:FOREST,margin:[0,0,0,4]},
        cbLine(!!A.zgoda_marketing,'(dobrowolnie) Wyrażam zgodę na przetwarzanie moich danych w celach marketingowych — informowania o nowych ofertach i współpracy (art. 6 ust. 1 lit. a RODO).'),
        cbLine(!!A.zgoda_wizerunek,'(dobrowolnie) Wyrażam zgodę na utrwalanie i wykorzystanie mojego wizerunku (zdjęcia/nagrania zespołowe) do celów wewnętrznych i promocyjnych Zleceniodawcy (art. 6 ust. 1 lit. a RODO).'),
        {text:'Zgody są dobrowolne, można je wycofać w każdym czasie, a ich brak nie wpływa na zawarcie ani ważność umowy.',italics:true,fontSize:7.6,color:'#666',margin:[0,3,0,0]},
      ]}]]},layout:{hLineColor:()=>'#d8d8d8',vLineColor:()=>'#d8d8d8'},margin:[0,2,0,0]},
      {columns:[{text:'________________________\nMiejscowość i data',fontSize:8,color:'#444',alignment:'center'},
                {text:'________________________\nCzytelny podpis',fontSize:8,color:'#444',alignment:'center'}],margin:[0,30,0,0]},
    ],
  };
}

var docUmowa = (function(){
// Umowa zlecenia nr 1/UZ/2026 — pdfmake docDefinition (HR-пакет FAYNA)
// Стиль/верстка ідентичні docRODO у kadry_pdf.js

// порожня підкреслена лінія (відповідник bl() з Python): inline span з підкресленням
function bl(w) {
  // w у px → пробіли; ширша лінія = більше пробілів. ~150px ≈ 26, ~220px ≈ 38
  const n = Math.round((w || 180) / 5.8);
  return { text: ' '.repeat(n), decoration: 'underline', color: '#999' };
}

// заповнене поле або порожня лінія (відповідник vline())
function vline(v, w) {
  return (v !== undefined && v !== null && String(v).trim() !== '') ? fld(String(v)) : bl(w);
}

// фірмові дані стале
const TERMS = {
  nr: '1/UZ/2026', stale: '2 500', prowizja: '120',
  clawback: '14', wyplata: '10.', kara: '10 000', wypow: '14',
};

function adresZam(A) {
  const parts = [];
  if (A.adres_zam_ulica) parts.push(String(A.adres_zam_ulica).trim());
  const line2 = [A.adres_zam_kod, A.adres_zam_miasto].filter(Boolean).map(s => String(s).trim()).join(' ');
  if (line2) parts.push(line2);
  const base = parts.join(', ');
  const reg = [A.adres_zam_woj, A.adres_zam_powiat_gmina].filter(Boolean).map(s => String(s).trim()).join(' / ');
  return [base, reg].filter(Boolean).join(', ');
}

// стиль абзацу (justify) як <p> у CSS еталону
function p(content, extra) {
  return Object.assign({ text: content, alignment: 'justify', margin: [0, 4, 0, 0] }, extra || {});
}

function docUmowa(A) {
  A = A || {};
  const nameInst = A.name_inst || 'Danielem Indryszczakiem';
  const zam = adresZam(A);
  const zamNode = zam ? fld(zam) : bl(220);

  const content = [
    ...header(),
    ...h1('UMOWA ZLECENIA nr ' + TERMS.nr,
      'z wynagrodzeniem stałym i prowizyjnym (art. 734 i nast. Kodeksu cywilnego)'),

    p(['zawarta w Ostrowie Wielkopolskim w dniu ', bl(150), ' 2026 r. pomiędzy:']),
    p([
      { text: 'FAYNA DIGITAL sp. z o.o.', bold: true },
      ' z siedzibą w Ostrowie Wielkopolskim, ul. Kaliska 45, 63-400 Ostrów Wielkopolski, wpisaną do rejestru przedsiębiorców KRS pod numerem 0001211419, NIP 6222868819, REGON 543493338, reprezentowaną przez Panią Irynę Shevchenko – Prezesa Zarządu, zwaną dalej „Zleceniodawcą”,',
    ]),
    p('a'),
    p([
      'Panem ', fld(nameInst), ', zamieszkałym ', zamNode,
      ', legitymującym się dokumentem tożsamości ', vline(A.dowod, 150),
      ', PESEL ', vline(A.pesel, 150),
      ', zwanym dalej „Zleceniobiorcą”, zwanymi dalej łącznie „Stronami”.',
    ]),

    h2('§ 1. Przedmiot umowy'),
    p('1. Zleceniodawca zleca, a Zleceniobiorca zobowiązuje się do osobistego wykonywania czynności z zakresu pozyskiwania i obsługi klienta oraz prowadzenia klienta przez cały proces współpracy, obejmujących w szczególności: a) pozyskiwanie klientów — kontakt telefoniczny z bazą potencjalnych klientów (leadów) w systemie CRM oraz tworzenie i publikację treści w mediach społecznościowych Zleceniodawcy (m.in. posty, relacje) w celu generowania zapytań; b) obsługę zapytań napływających (inbound) i wychodzących — telefon, e-mail, komunikatory; c) prowadzenie rozmów z klientem, rozpoznanie jego potrzeb i oczekiwań oraz zebranie informacji niezbędnych do przygotowania oferty i specyfikacji założeń projektu; d) przygotowanie i przedstawienie oferty, uzgodnienie i finalizację warunków oraz doprowadzenie do zawarcia umowy i dokonania płatności; e) koordynację i nadzór nad realizacją projektu (kontakt między klientem a zespołem realizującym), obsługę posprzedażową oraz budowanie i utrzymywanie relacji z klientem; f) bieżące prowadzenie dokumentacji i statusów w systemie CRM; g) współpracę z instytucjami (m.in. szkołami, jednostkami samorządu terytorialnego) oraz przy realizacji bieżących projektów Zleceniodawcy.'),
    p('2. Czynności dotyczą: a) produktów i usług własnych Zleceniodawcy, w tym usług z zakresu marketingu, mediów społecznościowych, reklamy, wdrożeń i obsługi systemów CRM/ERP (m.in. Odoo) oraz automatyzacji procesów biznesowych; b) produktów i usług podmiotów, na rzecz których Zleceniodawca świadczy usługi pośrednictwa, marketingu lub obsługi sprzedaży, w tym usług turystycznych oraz obozów i wypoczynku dla dzieci i młodzieży.'),
    p('3. Zakres asortymentu oraz lista podmiotów, o których mowa w ust. 2 lit. b, mogą ulegać zmianom w okresie obowiązywania umowy bez konieczności jej aneksowania, w ramach ogólnego przedmiotu określonego w niniejszym paragrafie.'),
    p('4. Czynności wykonywane są w języku polskim, a w przypadku klientów zagranicznych — także w języku angielskim.'),
    p('5. Zlecenie ma charakter starannego działania; Zleceniobiorca nie gwarantuje osiągnięcia określonego poziomu sprzedaży ani konkretnego rezultatu.'),

    h2('§ 2. Sposób wykonywania zlecenia i charakter umowy'),
    p('1. Zleceniobiorca wykonuje czynności samodzielnie, z należytą starannością, zgodnie z ogólnymi standardami jakości i wymogami zgodności (compliance) Zleceniodawcy oraz obowiązującymi przepisami prawa.'),
    p('2. Zleceniobiorca samodzielnie ustala czas i organizację wykonywania czynności, z zastrzeżeniem konieczności kontaktu z klientami w godzinach ich dostępności. Zleceniodawca nie wyznacza Zleceniobiorcy sztywnego harmonogramu, nie sprawuje kierownictwa w rozumieniu art. 22 § 1 Kodeksu pracy; niniejsza umowa nie stanowi umowy o pracę.'),
    p([
      { text: '3. Praca zdalna.', bold: true },
      ' Zleceniodawca nie zapewnia ani nie wyznacza stałego miejsca wykonywania zlecenia. Czynności wykonywane są zdalnie, przy użyciu własnego sprzętu Zleceniobiorcy (komputer, łącze internetowe). Zleceniodawca zapewnia jedynie dostęp do systemu CRM, służbowej telefonii internetowej (VoIP) oraz materiałów sprzedażowych.',
    ]),
    p('4. Powierzenie wykonania zlecenia osobie trzeciej (substytucja) jest wyłączone (art. 738 § 1 Kodeksu cywilnego).'),

    h2('§ 3. Czas trwania umowy'),
    p(['1. Umowa zostaje zawarta na czas określony od dnia ', bl(120), ' do dnia ', bl(120), '.']),
    p('2. Po upływie powyższego okresu Strony mogą zawrzeć kolejną umowę na dalszy okres.'),

    h2('§ 4. Wynagrodzenie'),
    p([
      '1. Zleceniobiorcy przysługuje wynagrodzenie składające się z: a) części stałej w wysokości ', fld(TERMS.stale),
      ' zł brutto miesięcznie; b) części prowizyjnej (premii) w wysokości ', fld(TERMS.prowizja),
      ' zł brutto za każdą zakończoną sprzedaż, tj. doprowadzenie do zawarcia umowy z klientem i dokonania przez niego pełnej płatności.',
    ]),
    p([
      '2. Niezależnie od sposobu ustalenia wynagrodzenia, ', { text: 'łączne', bold: true },
      ' wynagrodzenie Zleceniobiorcy (część stała wraz z prowizją) za każdą godzinę wykonywania zlecenia nie będzie niższe niż minimalna stawka godzinowa ustalona zgodnie z ustawą z dnia 10 października 2002 r. o minimalnym wynagrodzeniu za pracę, obowiązująca w okresie rozliczeniowym (informacyjnie, wg stanu na dzień zawarcia umowy – 31,40 zł brutto/godz.). W razie gdyby łączne wynagrodzenie nie pokrywało tej kwoty, Zleceniodawca dokona wyrównania w terminie wypłaty.',
    ]),
    p('3. Okresem rozliczeniowym jest miesiąc kalendarzowy. Zleceniobiorca prowadzi i przekazuje ewidencję liczby godzin wykonywania zlecenia w formie dokumentowej przed terminem wypłaty. W razie nieprzekazania ewidencji przyjmuje się liczbę godzin wynikającą z zapisów systemu CRM oraz logowań do narzędzi udostępnionych przez Zleceniodawcę, przy czym Zleceniobiorca może obalić to domniemanie własnymi dowodami. Ewidencja przechowywana jest przez 3 lata od dnia wymagalności wynagrodzenia.'),
    p([
      '4. Prowizja nie przysługuje (a wypłacona podlega zwrotowi lub potrąceniu z kolejnego wynagrodzenia), jeżeli klient odstąpi od umowy, nastąpi zwrot płatności lub umowa z klientem nie dojdzie do skutku z przyczyn po stronie klienta w terminie ',
      fld(TERMS.clawback),
      ' dni od sprzedaży. Potrącenie nie może obniżyć wynagrodzenia za dany okres poniżej gwarantowanej minimalnej stawki godzinowej za potwierdzoną liczbę godzin (ust. 2).',
    ]),
    p([
      '5. Wynagrodzenie płatne jest do ', fld(TERMS.wyplata),
      ' dnia miesiąca następującego po okresie rozliczeniowym, przelewem na rachunek wskazany przez Zleceniobiorcę. Zleceniodawca, jako płatnik, odprowadza należne składki i zaliczki zgodnie z przepisami, na podstawie Oświadczenia zleceniobiorcy (załącznik nr 4).',
    ]),

    h2('§ 5. Obowiązki Zleceniodawcy'),
    p('Zleceniodawca zobowiązuje się do terminowej zapłaty wynagrodzenia oraz zapewnia dostęp do narzędzi, systemu CRM, telefonii VoIP, danych i materiałów niezbędnych do wykonania zlecenia, a także udziela niezbędnych informacji.'),

    h2('§ 6. Poufność, zakaz pozyskiwania klientów i ochrona danych'),
    p('1. Zleceniobiorca zobowiązuje się do zachowania w tajemnicy wszelkich informacji oraz danych osobowych Zleceniodawcy, jego klientów, a także klientów i kontrahentów tych klientów, do których uzyska dostęp w związku z wykonywaniem umowy, w szczególności za pośrednictwem systemu CRM — niezależnie od branży, kraju pochodzenia i charakteru tych podmiotów. Obowiązek ten obejmuje w szczególności dane osobowe dzieci i młodzieży będących uczestnikami obozów oraz dane dotyczące ich stanu zdrowia (dane szczególnej kategorii w rozumieniu art. 9 RODO). Zobowiązanie do poufności obowiązuje w czasie trwania umowy oraz bezterminowo po jej ustaniu.'),
    p('2. W czasie obowiązywania umowy oraz przez 12 miesięcy po jej ustaniu Zleceniobiorca nie będzie pozyskiwał klientów Zleceniodawcy ani podmiotów współpracujących na własny rachunek lub na rzecz podmiotów konkurencyjnych, ani wykorzystywał bazy klientów uzyskanej w związku z umową.'),
    p('3. Zasady przetwarzania danych osobowych przez Zleceniobiorcę reguluje Upoważnienie do przetwarzania danych osobowych udzielone zgodnie z art. 29 RODO (załącznik nr 1). Obowiązek informacyjny wobec Zleceniobiorcy określa Klauzula informacyjna RODO (załącznik nr 2).'),
    p([
      '4. Za każde naruszenie obowiązku zachowania poufności, o którym mowa w ust. 1, Zleceniobiorca zapłaci karę umowną w wysokości ',
      fld(TERMS.kara),
      ' zł, przy czym za jedno naruszenie uważa się jedno zdarzenie naruszające, niezależnie od liczby rekordów lub osób objętych tym zdarzeniem. Zapłata kary nie wyłącza dochodzenia odszkodowania przewyższającego jej wysokość. Odpowiedzialność z tytułu naruszenia przepisów o ochronie danych osobowych regulują odrębnie przepisy RODO oraz załącznik nr 1.',
    ]),
    p('5. Zleceniobiorca zobowiązuje się prowadzić działania marketingu telefonicznego i elektronicznego wyłącznie wobec osób, co do których istnieje zgodna z prawem podstawa kontaktu (RODO oraz przepisy o komunikacji elektronicznej).'),

    h2('§ 7. Prawa autorskie'),
    p('W razie stworzenia przez Zleceniobiorcę utworów w rozumieniu ustawy o prawie autorskim i prawach pokrewnych (m.in. materiałów sprzedażowych, treści, grafik), z chwilą ich przekazania autorskie prawa majątkowe przechodzą na Zleceniodawcę w ramach wynagrodzenia z § 4, na następujących polach eksploatacji (art. 50): utrwalanie i zwielokrotnianie dowolną techniką, wprowadzanie do obrotu, publiczne udostępnianie, w tym w sieci Internet w taki sposób, aby każdy mógł mieć do nich dostęp w miejscu i czasie przez siebie wybranym, a także wykorzystanie w materiałach marketingowych i reklamowych we wszelkich mediach. Przeniesienie obejmuje zezwolenie na wykonywanie praw zależnych oraz własność egzemplarzy/nośników.'),
    p([
      { text: 'Uwaga: skuteczne przeniesienie autorskich praw majątkowych wymaga formy pisemnej pod rygorem nieważności (art. 53 ustawy). Niniejszy paragraf wymaga zatem podpisu własnoręcznego albo ', italics: true, fontSize: 8.2, color: '#666' },
      { text: 'kwalifikowanego', italics: true, bold: true, fontSize: 8.2, color: '#666' },
      { text: ' podpisu elektronicznego (art. 78¹ Kodeksu cywilnego) — zwykły (niekwalifikowany) podpis elektroniczny jest niewystarczający.', italics: true, fontSize: 8.2, color: '#666' },
    ]),

    h2('§ 8. Rozwiązanie umowy'),
    p([
      '1. Każdej ze Stron przysługuje prawo wypowiedzenia umowy z zachowaniem ', fld(TERMS.wypow),
      '-dniowego okresu wypowiedzenia.',
    ]),
    p('2. Z ważnych powodów każda ze Stron może wypowiedzieć umowę ze skutkiem natychmiastowym (art. 746 Kodeksu cywilnego); prawa tego nie można skutecznie wyłączyć.'),
    p('3. W razie wypowiedzenia Zleceniobiorcy przysługuje wynagrodzenie odpowiadające dotychczas wykonanym czynnościom oraz potwierdzonej liczbie godzin do dnia rozwiązania umowy.'),
    p('4. Wypowiedzenie wymaga formy dokumentowej.'),

    h2('§ 9. Postanowienia końcowe'),
    p('1. W sprawach nieuregulowanych stosuje się przepisy Kodeksu cywilnego, w szczególności art. 734 i nast.'),
    p('2. Zmiany umowy wymagają formy pisemnej pod rygorem nieważności.'),
    p('3. Spory rozstrzyga sąd właściwy miejscowo dla siedziby Zleceniodawcy.'),
    p('4. Umowę sporządzono w dwóch jednobrzmiących egzemplarzach, po jednym dla każdej ze Stron.'),
    p('5. Załączniki: nr 1 – Upoważnienie do przetwarzania danych osobowych (art. 29 RODO); nr 2 – Klauzula informacyjna RODO; nr 3 – Kwestionariusz osobowy; nr 4 – Oświadczenie zleceniobiorcy (ZUS/US i podatki).'),

    {
      columns: [
        { text: '________________________\nZleceniodawca', fontSize: 8, color: '#444', alignment: 'center' },
        { text: '________________________\nZleceniobiorca', fontSize: 8, color: '#444', alignment: 'center' },
      ],
      margin: [0, 30, 0, 0],
    },
  ];

  return {
    pageSize: 'A4',
    pageMargins: [40, 44, 40, 40],
    defaultStyle: { font: 'Roboto', fontSize: 9, color: INK },
    content,
  };
}

return docUmowa;
})();

var docKwestionariusz = (function(){
// === Kwestionariusz osobowy (załącznik nr 3 do Umowy zlecenia) ===
// Текст ДОСЛІВНО з gen_hr_pack_fayna.py -> doc_kwest()

// порожня підкреслена лінія (відповідник bl() у Python)
function bl() {
  return { text: ' '.repeat(40), decoration: 'underline', color: '#999' };
}
// значення-рядок з A (порожнє для null/undefined/true/false)
function a(A, key) {
  const v = A[key];
  if (v === undefined || v === null || v === true || v === false) return '';
  return String(v).trim();
}
// заповнене поле (fld) або порожня лінія
function vline(A, key) {
  const v = a(A, key);
  return v ? fld(v) : bl();
}
function adres_zam(A) {
  const parts = [];
  if (a(A, 'adres_zam_ulica')) parts.push(a(A, 'adres_zam_ulica'));
  const line2 = [a(A, 'adres_zam_kod'), a(A, 'adres_zam_miasto')].filter(Boolean).join(' ');
  if (line2) parts.push(line2);
  return parts.join(', ');
}
function adres_zam_full(A) {
  const base = adres_zam(A);
  const reg = [a(A, 'adres_zam_woj'), a(A, 'adres_zam_powiat_gmina')].filter(Boolean).join(' / ');
  return [base, reg].filter(Boolean).join(', ');
}

function docKwestionariusz(A) {
  A = A || {};
  const fullname = A.fullname || 'Daniel Indryszczak';
  const tel = a(A, 'tel') || A.tel || '535 972 435';
  const email = a(A, 'email') || A.email || 'daniel.indryszczak@gmail.com';

  const data_miejsce = [a(A, 'data_urodzenia'), a(A, 'miejsce_urodzenia')].filter(Boolean).join(' — ');
  const azf = adres_zam_full(A);

  // [label, value-content]
  const rows = [
    ['Imię i nazwisko', fld(fullname)],
    ['Nazwisko rodowe', vline(A, 'nazwisko_rodowe')],
    ['Imiona rodziców', vline(A, 'imiona_rodzicow')],
    ['Data i miejsce urodzenia', data_miejsce ? fld(data_miejsce) : bl()],
    ['Obywatelstwo', vline(A, 'obywatelstwo')],
    ['PESEL', vline(A, 'pesel')],
    ['Adres zameldowania (woj./powiat/gmina)', azf ? fld(azf) : bl()],
    ['Data zameldowania', bl()],
    ['Adres do korespondencji (jeśli inny)', vline(A, 'adres_koresp')],
    ['Telefon', fld(tel)],
    ['E-mail', fld(email)],
    ['Wykształcenie', vline(A, 'wyksztalcenie')],
    ['Zawód wykonywany', vline(A, 'zawod')],
    ['Oddział NFZ', vline(A, 'nfz')],
    ['Urząd Skarbowy (właściwy)', vline(A, 'us')],
    ['Powiatowy Urząd Pracy (jeśli dotyczy)', bl()],
    ['Działalność gospodarcza (objęcie ZUS) — TAK/NIE',
      A.zus3 === 'TAK' ? fld('TAK') : (A.zus3 === 'NIE' ? fld('NIE') : bl())],
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
      ...h1('KWESTIONARIUSZ OSOBOWY', 'Zleceniobiorca — dane do umowy zlecenia'),
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
          { text: 'Potwierdzam zapoznanie się z Klauzulą informacyjną RODO (załącznik nr 2). Dane zawarte w niniejszym kwestionariuszu są przetwarzane przez FAYNA DIGITAL sp. z o.o. na podstawie art. 6 ust. 1 lit. b i c RODO (zawarcie i wykonanie umowy oraz obowiązki prawne Zleceniodawcy) — zgoda nie jest wymagana.', fontSize: 8.2 },
        ] }]] },
        layout: { hLineColor: () => '#d8d8d8', vLineColor: () => '#d8d8d8' },
        margin: [0, 8, 0, 0],
      },
      {
        columns: [
          { text: '________________________\nMiejscowość i data', fontSize: 8, color: '#444', alignment: 'center' },
          { text: '________________________\nCzytelny podpis', fontSize: 8, color: '#444', alignment: 'center' },
        ],
        margin: [0, 30, 0, 0],
      },
    ],
  };
}

return docKwestionariusz;
})();

var docZUS = (function(){
// Oświadczenie zleceniobiorcy (ZUS / US + podatki) — dokument "zus"
// Tekst dosłownie z gen_hr_pack_fayna.py :: doc_zus(). Styl jak docRODO.

// porożnia podkreślona linia (odpowiednik `bl` z Pythona)
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

function docZUS(A) {
  A = A || {};
  const fullname = A.fullname || 'Daniel Indryszczak';

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
      ...h1('OŚWIADCZENIE ZLECENIOBIORCY (ZUS / US)', 'status ubezpieczeniowy, wnioski o ubezpieczenia i oświadczenia podatkowe'),

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
          box(A.kup === '20'), { text: '20% (standardowe)', width: 'auto', fontSize: 8.6, margin: [2, 0, 8, 0] },
          box(A.kup === '50'), { text: '50% do części wynagrodzenia za przeniesienie praw autorskich (§ 7 umowy), w granicach rocznego limitu ustawowego.', width: '*', fontSize: 8.6, margin: [2, 0, 0, 0] },
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

      h2('Sekcja E — Oświadczenia końcowe'),
      { text: '1. Oświadczam, że powyższe dane są prawdziwe; jestem świadomy odpowiedzialności karnej za złożenie fałszywego oświadczenia (art. 233 § 1 Kodeksu karnego).', fontSize: 8.2, margin: [0, 1, 0, 1] },
      { text: '2. Zobowiązuję się niezwłocznie informować Zleceniodawcę o każdej zmianie statusu mającej wpływ na ubezpieczenia lub rozliczenia podatkowe.', fontSize: 8.2, margin: [0, 1, 0, 1] },
      { text: '3. Zapoznałem się z klauzulą informacyjną RODO Zleceniodawcy (załącznik nr 2).', fontSize: 8.2, margin: [0, 1, 0, 1] },

      {
        columns: [
          { text: '________________________\nMiejscowość i data', fontSize: 8, color: '#444', alignment: 'center' },
          { text: '________________________\nCzytelny podpis', fontSize: 8, color: '#444', alignment: 'center' },
        ], margin: [0, 26, 0, 0],
      },
    ],
  };
}

return docZUS;
})();

var docUpowaznienie = (function(){
// Upoważnienie do przetwarzania danych osobowych (art. 29 RODO)
// Załącznik nr 1 do Umowy zlecenia. Текст ДОСЛІВНО з doc_upowaznienie() (Python).

const NR = '1/UZ/2026';

// порожня підкреслена лінія (як bl у Python): фіксованої ширини, baseline-aligned
function bl(w) {
  return { text: ' '.repeat(Math.max(8, Math.round((w || 150) / 4))), decoration: 'underline', color: '#999' };
}

// заповнене поле (підкреслено) або порожня лінія
function vline(v, w) {
  return (v !== undefined && v !== null && String(v).trim() !== '') ? fld(v) : bl(w);
}

function docUpowaznienie(A) {
  A = A || {};
  const nameAcc = A.name_acc || 'Pana Daniela Indryszczaka';
  const justify = { alignment: 'justify', margin: [0, 4, 0, 4] };

  return {
    pageSize: 'A4',
    pageMargins: [40, 44, 40, 40],
    defaultStyle: { font: 'Roboto', fontSize: 9, color: INK },
    content: [
      ...header(),
      ...h1('UPOWAŻNIENIE DO PRZETWARZANIA DANYCH OSOBOWYCH',
        'art. 29 RODO — załącznik nr 1 do Umowy zlecenia'),

      { text: `Załącznik nr 1 do Umowy zlecenia nr ${NR}`, italics: true, fontSize: 7.6, color: '#666', margin: [0, 0, 0, 4] },
      { text: ['Sporządzone w Ostrowie Wielkopolskim w dniu ', bl(150), ' 2026 r.'], ...justify },
      {
        text: [
          { text: 'FAYNA DIGITAL sp. z o.o.', bold: true },
          ', ul. Kaliska 45, 63-400 Ostrów Wielkopolski, KRS 0001211419, NIP 6222868819, ',
          'reprezentowana przez Panią Irynę Shevchenko – Prezesa Zarządu, jako administrator danych osobowych (dalej „Administrator”), ',
          'niniejszym upoważnia ', fld(nameAcc), ', PESEL ', vline(A.pesel, 150), ' (dalej „Osoba upoważniona”), do przetwarzania ',
          'danych osobowych ',
          { text: 'w imieniu i na polecenie Administratora', bold: true },
          ', w zakresie i na zasadach określonych poniżej (art. 29 RODO).',
        ],
        ...justify,
      },

      h2('§ 1. Podstawa i charakter upoważnienia'),
      { text: '1. Osoba upoważniona przetwarza dane osobowe wyłącznie w ramach wykonywania umowy zlecenia, pod zwierzchnictwem i zgodnie z udokumentowanymi poleceniami Administratora; nie jest odrębnym administratorem ani podmiotem przetwarzającym.', ...justify },
      { text: '2. Przetwarzanie odbywa się w systemie CRM oraz w narzędziach udostępnionych przez Administratora.', ...justify },

      h2('§ 2. Zakres danych i kategorie osób'),
      { text: '1. Rodzaj danych: dane identyfikacyjne i kontaktowe (imię, nazwisko, telefon, e-mail, adres), dane dotyczące zamówień i płatności. W zakresie usług obozowych — także dane osobowe dzieci i młodzieży (uczestników) oraz dane dotyczące ich stanu zdrowia, stanowiące dane szczególnej kategorii w rozumieniu art. 9 RODO.', ...justify },
      { text: '2. Kategorie osób: klienci i potencjalni klienci Administratora, rodzice/opiekunowie, dzieci-uczestnicy obozów, kontrahenci oraz klienci podmiotów obsługiwanych przez Administratora.', ...justify },
      {
        text: [
          { text: 'Minimalizacja (art. 5 ust. 1 lit. c RODO):', bold: true },
          ' Osoba upoważniona przetwarza wyłącznie dane niezbędne do realizacji zlecenia. Dostęp do danych szczególnej kategorii (art. 9 — stan zdrowia dzieci) przysługuje wyłącznie w zakresie ściśle niezbędnym; jeżeli realizacja zlecenia tego nie wymaga, Osoba upoważniona nie powinna mieć do nich dostępu.',
        ],
        ...justify,
      },

      h2('§ 3. Obowiązki Osoby upoważnionej'),
      { text: '1. Przetwarza dane wyłącznie na udokumentowane polecenie i zgodnie z instrukcjami Administratora.', ...justify },
      { text: '2. Zachowuje w tajemnicy dane oraz sposoby ich zabezpieczenia — w czasie trwania umowy i bezterminowo po jej ustaniu.', ...justify },
      { text: '3. Stosuje środki bezpieczeństwa wskazane przez Administratora (art. 32 RODO); wobec danych szczególnej kategorii — z najwyższą starannością.', ...justify },
      { text: '4. Nie kopiuje, nie eksportuje ani nie przechowuje danych poza systemami udostępnionymi przez Administratora i nie udostępnia ich osobom trzecim.', ...justify },
      { text: '5. Niezwłocznie, nie później niż w ciągu 24 godzin, zawiadamia Administratora o każdym podejrzeniu lub stwierdzeniu naruszenia ochrony danych.', ...justify },
      { text: '6. Pomaga Administratorowi w realizacji praw osób, których dane dotyczą, oraz w wykonaniu obowiązków z art. 32–36 RODO.', ...justify },

      h2('§ 4. Dane podmiotów obsługiwanych przez Administratora'),
      { text: 'W zakresie, w jakim Administrator przetwarza dane jako podmiot przetwarzający na rzecz swoich klientów (np. organizatorów obozów), Osoba upoważniona przetwarza te dane wyłącznie w granicach poleceń Administratora oraz zgody i poleceń administratorów tych danych.', ...justify },

      h2('§ 5. Czas obowiązywania i ustanie'),
      { text: '1. Upoważnienie obowiązuje przez czas trwania umowy zlecenia i wygasa wraz z nią lub z chwilą jego odwołania przez Administratora.', ...justify },
      { text: '2. Z chwilą ustania Osoba upoważniona zaprzestaje przetwarzania, zwraca lub usuwa nośniki danych i nie zachowuje ich kopii, chyba że przepisy nakazują dalsze przechowywanie.', ...justify },

      h2('§ 6. Odpowiedzialność'),
      { text: 'Do naruszenia obowiązków wynikających z niniejszego upoważnienia stosuje się odpowiednio postanowienia § 6 umowy zlecenia (poufność i kara umowna). Sporządzono w dwóch egzemplarzach, po jednym dla każdej ze Stron.', ...justify },

      {
        columns: [
          { text: '________________________\nAdministrator (udzielający upoważnienia)', fontSize: 8, color: '#444', alignment: 'center' },
          { text: '________________________\nOsoba upoważniona (potwierdzam przyjęcie)', fontSize: 8, color: '#444', alignment: 'center' },
        ],
        margin: [0, 30, 0, 0],
      },
    ],
  };
}

return docUpowaznienie;
})();

var DOCS = [
  ['1_Umowa_zlecenia', docUmowa],
  ['2_Kwestionariusz_osobowy', docKwestionariusz],
  ['3_Klauzula_RODO', docRODO],
  ['4_Oswiadczenie_ZUS_podatki', docZUS],
  ['5_Upowaznienie_RODO_art29', docUpowaznienie],
];
function genAll(A){
  var slug = (A && A.fullname ? A.fullname : 'kandydat').trim().replace(/\s+/g,'_');
  DOCS.forEach(function(d){
    pdfMake.createPdf(d[1](A||{})).download(d[0] + '_' + slug + '.pdf');
  });
}
var api = { docUmowa:docUmowa, docKwestionariusz:docKwestionariusz, docRODO:docRODO,
            docZUS:docZUS, docUpowaznienie:docUpowaznienie, DOCS:DOCS, genAll:genAll };
if (typeof window!=='undefined') window.KADRY = api;
if (typeof module!=='undefined' && module.exports) module.exports = api;
})();
