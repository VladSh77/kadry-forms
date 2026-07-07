// Netlify Function: submit-kadry (анкета кадри CampScout — campscout/anketa.html)
// Приймає заповнену анкету → генерує PDF-пакети НА СЕРВЕРІ (той самий код, що й у браузері)
// → зберігає у Netlify Blobs (живе на сервері) → надсилає адміну на пошту з вкладеннями.
//
// Env vars (Netlify dashboard → Site configuration → Environment variables):
//   GMAIL_USER         = адреса, з якої шлемо (Gmail/Workspace)
//   GMAIL_APP_PASSWORD = App Password цієї адреси (Google Account → Security → App Passwords)
//   ADMIN_EMAIL        = куди слати (за замовчуванням = GMAIL_USER)

const { getStore } = require('@netlify/blobs');
const nodemailer = require('nodemailer');
const PdfPrinter = require('pdfmake/src/printer');

const { makePrinter } = require('./lib/campscout_pdf');
const { docUmowaWychowawcaPL } = require('./lib/doc_umowa_wychowawca_pl');
const { docKwestPL } = require('./lib/doc_kwest_wychowawca_pl');
const { docRODOPL } = require('./lib/doc_rodo_wychowawca_pl');
const { docZUSPL } = require('./lib/doc_zus_wychowawca_pl');
const { docUpowaznieniePL } = require('./lib/doc_upowaznienie_wychowawca_pl');
const { docZgodaRSPTSPL } = require('./lib/doc_zgoda_rspts_pl');
const { docWolontariatWychowawcaUA } = require('./lib/doc_wolontariat_wychowawca_ua');
const { docZgodaRSPTS } = require('./lib/doc_zgoda_rspts_ua'); // українською, для кандидата

process.env.KADRY_FONTS = require('path').join(__dirname, 'lib', 'fonts');

function pdfBuffer(printer, docDefinition) {
  return new Promise((resolve, reject) => {
    const doc = printer.createPdfKitDocument(docDefinition);
    const chunks = [];
    doc.on('data', (c) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
    doc.end();
  });
}

function combinedContent(fns, A) {
  let content = [];
  fns.forEach((fn, i) => {
    const c = fn(A).content.slice();
    if (i > 0 && c.length) c[0] = Object.assign({}, c[0], { pageBreak: 'before' });
    content = content.concat(c);
  });
  return { pageSize: 'A4', pageMargins: [40, 44, 40, 40], defaultStyle: { font: 'Roboto', fontSize: 9, color: '#1c2420' }, content };
}

// мапінг анкети → значення для генераторів (той самий, що в anketa.html buildA_PL/buildA_UA)
function ulga26FromDob(dobStr) {
  if (!dobStr) return 'nie_dotyczy';
  const d = new Date(dobStr);
  if (isNaN(d)) return 'nie_dotyczy';
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age < 26 ? 'dotyczy' : 'nie_dotyczy';
}
const TRANSLIT_MAP = {
  'а':'a','б':'b','в':'v','г':'h','ґ':'g','д':'d','е':'e','є':'ie','ж':'zh','з':'z',
  'и':'y','і':'i','ї':'i','й':'i','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p',
  'р':'r','с':'s','т':'t','у':'u','ф':'f','х':'kh','ц':'ts','ч':'ch','ш':'sh','щ':'shch',
  'ю':'iu','я':'ia','ь':'', "'":'', '’':'', 'ʼ':''
};
function translitUaToLat(str) {
  if (!str) return '';
  return str.replace(/[а-щьюяїієґ']/gi, (ch) => {
    const lower = ch.toLowerCase();
    if (Object.prototype.hasOwnProperty.call(TRANSLIT_MAP, lower)) {
      let rep = TRANSLIT_MAP[lower];
      if (ch === ch.toUpperCase() && rep) rep = rep.charAt(0).toUpperCase() + rep.slice(1);
      return rep;
    }
    return ch;
  });
}
function buildA_PL(fd) {
  const dokPL = fd.dokument_pl_typ === 'karta_pobytu' ? 'karta pobytu' : 'paszport';
  return {
    umowa_nr: fd._docNr + '/WYC/2026',
    fullname: [fd.nazwisko_lat, fd.imie_lat].filter(Boolean).join(' '),
    data_urodzenia: fd.data_urodzenia,
    dowod: (dokPL + ' ' + (fd.dokument_pl_numer || '')).trim(),
    pesel: fd.brak_pesel ? '' : (fd.pesel || ''),
    adres_zam_ulica: fd.adresa_pl_override || translitUaToLat(fd.adresa_ua || ''),
    adres_zam_kod: '', adres_zam_miasto: '',
    tel: fd.tel, email: fd.email, iban: fd.iban,
    nazwisko_rodowe: fd.nazwisko_rodowe,
    imiona_rodzicow: [fd.imia_ojca, fd.imia_matky].filter(Boolean).join(', '),
    obywatelstwo: fd.obywatelstwo, miejsce_urodzenia: fd.miejsce_urodzenia,
    wyksztalcenie: fd.wyksztalcenie, zawod: fd.zawod,
    nfz: fd.nfz, us: fd.us, adres_koresp: fd.adres_koresp,
    adres_zam_woj: fd.adres_zam_woj, adres_zam_powiat_gmina: fd.adres_zam_powiat_gmina,
    zus1: fd.zus1, zus2: fd.zus2, zus3: fd.zus3, zus4: fd.zus4, zus5: fd.zus5,
    zus6: fd.zus6, zus7: fd.zus7, zus8: fd.zus8, zus9: fd.zus9,
    pit2: fd.pit2, pit2_czesc: fd.pit2_czesc || '1/12', bez_zaliczki: fd.bez_zaliczki, kup: '20',
    ulga26: ulga26FromDob(fd.data_urodzenia),
    data_od: fd.data_od, data_do: fd.data_do,
    zgoda_marketing: fd.zgoda_marketing, zgoda_wizerunek: fd.zgoda_wizerunek,
  };
}
function buildA_UA(fd) {
  const dokUA = fd.dokument_ua_typ === 'vnutrishnii' ? 'внутрішній паспорт' : 'закордонний паспорт';
  return {
    umowa_nr_ua: fd._docNr + '/2026',
    fullname: [fd.prizvyshche_ua, fd.imia_ua, fd.po_batkovi].filter(Boolean).join(' '),
    dowod: (dokUA + ' ' + (fd.dokument_ua_numer || '')).trim(),
    adres_zam_ulica: fd.adresa_ua, adres_zam_kod: '', adres_zam_miasto: '',
    tel: fd.tel, email: fd.email, data_od: fd.data_od, data_do: fd.data_do,
  };
}
function genDocNumber() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let fd;
  try {
    fd = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: 'Bad Request' };
  }

  const fullnameCheck = [fd.prizvyshche_ua, fd.imia_ua].filter(Boolean).join(' ') || [fd.nazwisko_lat, fd.imie_lat].filter(Boolean).join(' ');
  if (!fullnameCheck || !fd.tel) {
    return { statusCode: 400, body: 'fullname and tel required' };
  }

  fd._docNr = genDocNumber();
  const clientIp = event.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'невідомо';
  const userAgent = event.headers['user-agent'] || 'невідомо';
  const submittedAt = new Date().toISOString();
  const fname = fullnameCheck.replace(/\s+/g, '_');

  try {
    const A_PL = buildA_PL(fd);
    const A_UA = buildA_UA(fd);

    const printer = makePrinter(PdfPrinter);
    const [pdfPL, pdfUA, pdfRSPTS] = await Promise.all([
      pdfBuffer(printer, combinedContent([docUmowaWychowawcaPL, docKwestPL, docRODOPL, docZUSPL, docUpowaznieniePL, docZgodaRSPTSPL], A_PL)),
      pdfBuffer(printer, docWolontariatWychowawcaUA(A_UA)),
      pdfBuffer(printer, docZgodaRSPTS({ fullname: A_UA.fullname, data_urodzenia: fd.data_urodzenia, dowod: A_UA.dowod })),
    ]);

    // ── Зберігання на сервері (Netlify Blobs — персистентне сховище) ───────
    const store = getStore('kadry-submissions');
    const prefix = `${fd._docNr}_${fname}`;
    await Promise.all([
      store.set(`${prefix}/umowa_instruktor_PL.pdf`, pdfPL, { metadata: { contentType: 'application/pdf' } }),
      store.set(`${prefix}/dogovir_wolontariat_UA.pdf`, pdfUA, { metadata: { contentType: 'application/pdf' } }),
      store.set(`${prefix}/zgoda_rspts_UA.pdf`, pdfRSPTS, { metadata: { contentType: 'application/pdf' } }),
      store.set(`${prefix}/meta.json`, JSON.stringify({ ...fd, _ip: clientIp, _userAgent: userAgent, _submittedAt: submittedAt }, null, 2)),
    ]);

    // ── Email адміну з вкладеннями ───────────────────────────────────────
    const GMAIL_USER = process.env.GMAIL_USER;
    const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || GMAIL_USER;

    if (GMAIL_USER && GMAIL_APP_PASSWORD) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
      });
      await transporter.sendMail({
        from: GMAIL_USER,
        to: ADMIN_EMAIL,
        subject: `Нова анкета кадри: ${fullnameCheck} (${fd._docNr})`,
        text: [
          `Номер: ${fd._docNr}`,
          `Дата/час: ${submittedAt}`,
          `IP: ${clientIp}`,
          `User-Agent: ${userAgent}`,
          `Телефон: ${fd.tel || '—'}`,
          `Email: ${fd.email || '—'}`,
          `Адреса: ${fd.adresa_ua || '—'}`,
        ].join('\n'),
        attachments: [
          { filename: 'umowa_instruktor_PL.pdf', content: pdfPL },
          { filename: 'dogovir_wolontariat_UA.pdf', content: pdfUA },
          { filename: 'zgoda_rspts_UA.pdf', content: pdfRSPTS },
        ],
      });
    } else {
      console.warn('GMAIL_USER/GMAIL_APP_PASSWORD не задані — email не надіслано, PDF лишились у Blobs.');
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true, docNr: fd._docNr }),
    };
  } catch (err) {
    console.error('submit-kadry error', err.message, err.stack);
    return { statusCode: 502, body: 'Server error: ' + err.message };
  }
};
