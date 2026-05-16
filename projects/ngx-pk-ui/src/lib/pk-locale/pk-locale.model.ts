/**
 * pk-locale — shared locale data for month names, day names, and related
 * date/calendar strings across the ngx-pk-ui library.
 *
 * Supported locales: en · th · lo · fr · es · zh · ja · pt · de · ko · ru · vi · id · ar · hi · it · nl
 */

export type PkLocale =
  | 'en' | 'th' | 'lo'
  | 'fr' | 'es' | 'pt' | 'it' | 'de' | 'nl'
  | 'zh' | 'ja' | 'ko'
  | 'ru'
  | 'vi' | 'id'
  | 'ar' | 'hi';

export interface PkLocaleData {
  /** 3-4 char month abbreviations, index 0 = January … 11 = December */
  monthNamesShort: readonly string[];
  /** Full month names, index 0 = January … 11 = December */
  monthNamesFull: readonly string[];
  /** 2-3 char day abbreviations, index 0 = Sunday … 6 = Saturday */
  dayNamesShort: readonly string[];
  /** Full day names, index 0 = Sunday … 6 = Saturday */
  dayNamesFull: readonly string[];
  /** Text direction — 'rtl' for Arabic, Hebrew, etc. Defaults to 'ltr'. */
  direction: 'ltr' | 'rtl';
}

export const PK_LOCALE_DATA: Record<PkLocale, PkLocaleData> = {

  // ── English ───────────────────────────────────────────────────────────────
  en: {
    monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    monthNamesFull:  ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'],
    dayNamesShort:   ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    dayNamesFull:    ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    direction: 'ltr',
  },

  // ── Thai ──────────────────────────────────────────────────────────────────
  th: {
    monthNamesShort: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
                      'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'],
    monthNamesFull:  ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
                      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'],
    dayNamesShort:   ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'],
    dayNamesFull:    ['วันอาทิตย์', 'วันจันทร์', 'วันอังคาร', 'วันพุธ',
                      'วันพฤหัสบดี', 'วันศุกร์', 'วันเสาร์'],
    direction: 'ltr',
  },

  // ── Lao ───────────────────────────────────────────────────────────────────
  lo: {
    monthNamesShort: ['ມ.ກ.', 'ກ.ພ.', 'ມ.ນ.', 'ມ.ສ.', 'ພ.ພ.', 'ມ.ຖ.',
                      'ກ.ລ.', 'ສ.ຫ.', 'ກ.ຍ.', 'ຕ.ລ.', 'ພ.ຈ.', 'ທ.ວ.'],
    monthNamesFull:  ['ມັງກອນ', 'ກຸມພາ', 'ມີນາ', 'ເມສາ', 'ພຶດສະພາ', 'ມິຖຸນາ',
                      'ກໍລະກົດ', 'ສິງຫາ', 'ກັນຍາ', 'ຕຸລາ', 'ພະຈິກ', 'ທັນວາ'],
    dayNamesShort:   ['ອາ.', 'ຈ.', 'ອ.', 'ພ.', 'ພຫ.', 'ສກ.', 'ສາ.'],
    dayNamesFull:    ['ວັນອາທິດ', 'ວັນຈັນ', 'ວັນອັງຄານ', 'ວັນພຸດ',
                      'ວັນພະຫັດ', 'ວັນສຸກ', 'ວັນເສົາ'],
    direction: 'ltr',
  },

  // ── French ────────────────────────────────────────────────────────────────
  fr: {
    monthNamesShort: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun',
                      'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
    monthNamesFull:  ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
                      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
    dayNamesShort:   ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
    dayNamesFull:    ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
    direction: 'ltr',
  },

  // ── Spanish ───────────────────────────────────────────────────────────────
  es: {
    monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
                      'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    monthNamesFull:  ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    dayNamesShort:   ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
    dayNamesFull:    ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    direction: 'ltr',
  },

  // ── Portuguese ────────────────────────────────────────────────────────────
  pt: {
    monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
                      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    monthNamesFull:  ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    dayNamesShort:   ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    dayNamesFull:    ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    direction: 'ltr',
  },

  // ── Italian ───────────────────────────────────────────────────────────────
  it: {
    monthNamesShort: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu',
                      'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'],
    monthNamesFull:  ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
                      'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
    dayNamesShort:   ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'],
    dayNamesFull:    ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'],
    direction: 'ltr',
  },

  // ── German ────────────────────────────────────────────────────────────────
  de: {
    monthNamesShort: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun',
                      'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
    monthNamesFull:  ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
                      'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
    dayNamesShort:   ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
    dayNamesFull:    ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
    direction: 'ltr',
  },

  // ── Dutch ─────────────────────────────────────────────────────────────────
  nl: {
    monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
                      'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'],
    monthNamesFull:  ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni',
                      'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'],
    dayNamesShort:   ['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za'],
    dayNamesFull:    ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'],
    direction: 'ltr',
  },

  // ── Chinese (Simplified) ──────────────────────────────────────────────────
  zh: {
    monthNamesShort: ['1月', '2月', '3月', '4月', '5月', '6月',
                      '7月', '8月', '9月', '10月', '11月', '12月'],
    monthNamesFull:  ['一月', '二月', '三月', '四月', '五月', '六月',
                      '七月', '八月', '九月', '十月', '十一月', '十二月'],
    dayNamesShort:   ['日', '一', '二', '三', '四', '五', '六'],
    dayNamesFull:    ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    direction: 'ltr',
  },

  // ── Japanese ─────────────────────────────────────────────────────────────
  ja: {
    monthNamesShort: ['1月', '2月', '3月', '4月', '5月', '6月',
                      '7月', '8月', '9月', '10月', '11月', '12月'],
    monthNamesFull:  ['1月', '2月', '3月', '4月', '5月', '6月',
                      '7月', '8月', '9月', '10月', '11月', '12月'],
    dayNamesShort:   ['日', '月', '火', '水', '木', '金', '土'],
    dayNamesFull:    ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
    direction: 'ltr',
  },

  // ── Korean ────────────────────────────────────────────────────────────────
  ko: {
    monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월',
                      '7월', '8월', '9월', '10월', '11월', '12월'],
    monthNamesFull:  ['1월', '2월', '3월', '4월', '5월', '6월',
                      '7월', '8월', '9월', '10월', '11월', '12월'],
    dayNamesShort:   ['일', '월', '화', '수', '목', '금', '토'],
    dayNamesFull:    ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
    direction: 'ltr',
  },

  // ── Russian ───────────────────────────────────────────────────────────────
  ru: {
    monthNamesShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн',
                      'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
    monthNamesFull:  ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
                      'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
    dayNamesShort:   ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    dayNamesFull:    ['Воскресенье', 'Понедельник', 'Вторник', 'Среда',
                      'Четверг', 'Пятница', 'Суббота'],
    direction: 'ltr',
  },

  // ── Vietnamese ────────────────────────────────────────────────────────────
  vi: {
    monthNamesShort: ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6',
                      'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'],
    monthNamesFull:  ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
                      'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
    dayNamesShort:   ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
    dayNamesFull:    ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư',
                      'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'],
    direction: 'ltr',
  },

  // ── Indonesian ────────────────────────────────────────────────────────────
  id: {
    monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
                      'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
    monthNamesFull:  ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'],
    dayNamesShort:   ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
    dayNamesFull:    ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
    direction: 'ltr',
  },

  // ── Arabic ────────────────────────────────────────────────────────────────
  ar: {
    monthNamesShort: ['ينا', 'فبر', 'مار', 'أبر', 'ماي', 'يون',
                      'يول', 'أغس', 'سبت', 'أكت', 'نوف', 'ديس'],
    monthNamesFull:  ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
                      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
    dayNamesShort:   ['أح', 'اث', 'ثل', 'أر', 'خم', 'جم', 'سب'],
    dayNamesFull:    ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء',
                      'الخميس', 'الجمعة', 'السبت'],
    direction: 'rtl',
  },

  // ── Hindi ─────────────────────────────────────────────────────────────────
  hi: {
    monthNamesShort: ['जन', 'फ़र', 'मार', 'अप्र', 'मई', 'जून',
                      'जुल', 'अग', 'सित', 'अक्त', 'नव', 'दिस'],
    monthNamesFull:  ['जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
                      'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'],
    dayNamesShort:   ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'],
    dayNamesFull:    ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार',
                      'गुरुवार', 'शुक्रवार', 'शनिवार'],
    direction: 'ltr',
  },

};

/**
 * Returns locale data for the given locale code.
 * Falls back to English if the locale is not recognized.
 */
export function getPkLocaleData(locale: string): PkLocaleData {
  return PK_LOCALE_DATA[locale as PkLocale] ?? PK_LOCALE_DATA['en'];
}
