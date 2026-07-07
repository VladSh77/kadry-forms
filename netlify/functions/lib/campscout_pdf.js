// Спільний модуль pdfmake для пакету документів вихователя CampScout (JDG — Volodymyr Shevchenko)
const path = require('path');
const FOREST = '#1B4332', GOLD = '#F7CB74', INK = '#1c2420';
const FONTS_DIR = process.env.KADRY_FONTS || path.join(__dirname, 'fonts');

// Реквізити CampScout — JDG, БЕЗ KRS (JDG не має KRS), з ROT (реєстр туроператора)
const CAMPSCOUT = {
  nazwa: 'CAMPSCOUT — Volodymyr Shevchenko',
  adres: 'ul. Kaliska 45, 63-400 Ostrów Wielkopolski',
  nip: '6222847059',
  regon: '524720757',
  rot: '1129',
  email: 'admin@campscout.eu',
  reprezentant: 'Volodymyr Shevchenko',
};

function makePrinter(PdfPrinter) {
  return new PdfPrinter({
    Roboto: {
      normal: path.join(FONTS_DIR, 'Roboto-Regular.ttf'),
      bold: path.join(FONTS_DIR, 'Roboto-Medium.ttf'),
      italics: path.join(FONTS_DIR, 'Roboto-Italic.ttf'),
      bolditalics: path.join(FONTS_DIR, 'Roboto-MediumItalic.ttf'),
    },
  });
}

// вектор-чекбокс: порожній квадрат або зелений із галкою
function box(checked) {
  const c = [{
    type: 'rect', x: 0, y: 1.5, w: 8.5, h: 8.5, lineWidth: .8,
    lineColor: checked ? FOREST : '#888',
    ...(checked ? { color: FOREST } : {}),
  }];
  if (checked) { // біла галка
    c.push({ type: 'line', x1: 1.8, y1: 6, x2: 3.6, y2: 8, lineWidth: 1.1, lineColor: '#fff' });
    c.push({ type: 'line', x1: 3.6, y1: 8, x2: 7, y2: 3, lineWidth: 1.1, lineColor: '#fff' });
  }
  return { canvas: c, width: 13 };
}

// чекбокс + підпис (рядок)
function cbLine(checked, text) {
  return { columns: [box(checked), { text, width: '*', fontSize: 9 }], columnGap: 3, margin: [0, 2, 0, 2] };
}

// TAK/NIE (lang='ua' → ТАК/НІ) для комірки таблиці; розпізнає значення в обох варіантах написання
function yn(val, lang) {
  const isUA = lang === 'ua';
  const yesLabel = isUA ? 'ТАК' : 'TAK';
  const noLabel = isUA ? 'НІ' : 'NIE';
  const isYes = val === 'TAK' || val === 'ТАК';
  const isNo = val === 'NIE' || val === 'НІ';
  return {
    columns: [
      box(isYes), { text: yesLabel, width: 'auto', fontSize: 8.6, margin: [2, 0, 8, 0] },
      box(isNo), { text: noLabel, width: 'auto', fontSize: 8.6, margin: [2, 0, 0, 0] },
    ],
    columnGap: 1,
  };
}

function fld(v) { return { text: String(v), bold: true, color: FOREST, decoration: 'underline' }; }

// нумер угоди/умови, спільний для пакету документів вихователя (PL і UA)
const UMOWA_NR = '1/WYC/2026';

function header(lang) {
  const repLine = lang === 'ua'
    ? `представник: ${CAMPSCOUT.reprezentant} — власник (організатор)`
    : `reprezentant: ${CAMPSCOUT.reprezentant} — właściciel (organizator)`;
  return [
    { text: 'CAMPSCOUT', bold: true, fontSize: 12, color: FOREST },
    { text: `${CAMPSCOUT.nazwa} · ${CAMPSCOUT.adres}`, fontSize: 7.2, color: '#555' },
    { text: `NIP ${CAMPSCOUT.nip} · REGON ${CAMPSCOUT.regon} · ROT ${CAMPSCOUT.rot} · ${repLine} · ${CAMPSCOUT.email}`, fontSize: 7.2, color: '#555' },
    { canvas: [{ type: 'line', x1: 0, y1: 2, x2: 515, y2: 2, lineWidth: 2, lineColor: GOLD }], margin: [0, 4, 0, 10] },
  ];
}

function h1(t, sub) {
  return [
    { text: t, fontSize: 13, color: FOREST, bold: true, margin: [0, 2, 0, 1] },
    { text: sub, fontSize: 8.5, color: GOLD, bold: true, margin: [0, 0, 0, 10] },
  ];
}

function h2(t) { return { text: t, fontSize: 9.5, color: FOREST, bold: true, margin: [0, 9, 0, 3] }; }

module.exports = { makePrinter, box, cbLine, yn, fld, header, h1, h2, CAMPSCOUT, UMOWA_NR, FOREST, GOLD, INK };
