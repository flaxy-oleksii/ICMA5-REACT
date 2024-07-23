import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  // .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    // debug: true,
    // fallbackLng: 'en',
    fallbackLng: 'ua',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: {
        translation: {
          description: {
            part1: 'Edit <1>src/App.js</1> and save to reload.',
            accounts: 'Accounts',
            loading: 'Loading...',
            view: 'View',
            edit: 'Edit',
            delete: 'Delete',
            add: 'Add',
            report: 'Report',
            ppvText: 'Please provide a valid'
          },
          accounts: {
          }
        }
      },
      ua: {
        translation: {
          description: {
            part1: 'Edit <1>src/App.js</1> and save to reload.',
            accounts: 'Користувачі',
            loading: 'Огляд записів...',
            view: 'Огляд',
            edit: 'Редагування',
            delete: 'Видалити',
            add: 'Додати',
            report: 'Звіт',
            ppvText: 'Вкажіть коректне значенння для'
          },
          accounts: {
            CLSCHETID: 'Ліц.рах.',
            CLSCHET: 'Л/р.підп.',
            CFIO: 'Прізвище та Ім`я по Батькові',
            CKODU: 'Вул.',
            CDOM: '№ буд.',
            CKV: '№ кв.',
            CIDNOM: 'Іден.код',
            NKOLP: 'К-ть мешк.',
            NPLOSHB: 'Площа з бал.',
            NPLOSH: 'Площа заг.',
            NPLOSHJ: 'Площа житл.',
            NPLOSHO: 'Площа опал.',
            NLGOT: 'Код пільги',
            CUDOST: '№ свід.',
            NKLGOT: 'К-ть пільг',
            LOTOP: 'Опал.(Так/Ні)',
            LGORV: 'ГВП(Так/Ні)',
            LCHDOMGV: 'Ліч.буд.(Так/Ні)ГВ',
            LCHKVGV: 'Ліч.кв.(Так/Ні)ГВ',
            LVODA: 'Вода(Так/Ні)',
            LKANAL: 'Канал.(Так/Ні)',
            LCHDOMV: 'Ліч.буд.(Так/Ні)ХВ',
            LCHKVV: 'Ліч.кв.(Так/Ні)ХВ',
            LKVAR: 'Кв.пл.(Так/Ні)',
            LETAJ: '1-ий пов.(Так/Ні)',
            LMUSOR: 'Сміття(Так/Ні)',
            LELEK: 'Ел.ен.(Так/Ні)',
            NPCHGV1: 'Пок.ліч.ГВ(Пот.М)',
            NPCHGV2: 'Пок.ліч.(Поп.М)',
            NPCHV1: 'Пок.ліч.(Пот.М)ХВ',
            NPCHV2: 'Пок.ліч.(Поп.М)ХВ',
            CNOMDOG: '№ дог.',
            DDATADOG: 'Дата дог.',
            NPRIZKV: 'Озн.кв.',
            LCHSEK: 'Озн.пр.сек.(Так/Ні)',
            NKODNORV: 'Код норми(Вода)',
            NKODNORK: 'Код норми(Канал.)',
            DDATASVID: 'Дата видачі свід.',
            LCHKVV2: 'Ліч.кв.(Так/Ні)ХВ-2',
            NPCHV12: 'Пок.ліч.ХВ(Пот.М)-2',
            NPCHV22: 'Пок.ліч.ХВ(Поп.М)-2',
            LCHKVGV2: 'Ліч.кв.(Так/Ні)ГВ-2',
            NPCHGV12: 'Пок.ліч.ГВ(Пот.М)-2',
            NPCHGV22: 'Пок.ліч.ГВ(Поп.М)-2',
            CNCHGV1: '№ ліч.(гар.вода)-1',
            CNCHGV2: '№ ліч.(гар.вода)-2',
            CNCHV1: '№ ліч.(хол.вода)-1',
            CNCHV2: '№ ліч.(хол.вода)-2',
            NSLGOTOT: 'Пільга-опал.',
            NSLGOTKV: 'Пільга-кв.пл.',
            NSLGOTV: 'Пільга-хол.вода',
            NSLGOTGV: 'Пільга-гар.вода',
            NSLGOTKAN: 'Пільга-канал.',
            NSLGOTMUS: 'Пільга-сміття',
            NSLGOTEL: 'Пільга-ел.ен.',
            NSPLGOTOT: 'Пер.пільг-опал.',
            NSPLGOTKV: 'Пер.пільг-кв.пл.',
            NSPLGOTV: 'Пер.пільг-вода',
            NSPLGOTGV: 'Пер.пільг-гар.вода',
            NSPLGOTKAN: 'Пер.пільг-канал.',
            NSPLGOTMUS: 'Пер.пільг-сміття',
            NSPLGOTEL: 'Пер.пільг-ел.ен.',
            NKODNORGV: 'Норма хар.вода',
            LCHKVKAN: 'Ліч.кан.(Так/Ні)',
            LCHKVKAN2: 'Ліч.кан.-2(Так/Ні)',
            NPCHKAN1: 'Пок.ліч.(ПТМ)-1',
            NPCHKAN2: 'Пок.ліч.(ППМ)-1',
            NPCHKAN12: 'Пок.ліч.(ПТМ)-2',
            NPCHKAN22: 'Пок.ліч.(ППМ)-2',
            LOTKLV: 'Озн.відкл.ХВ(так/ні)',
            LOTKLGV: 'Озн.відкл.ГВ(так/ні)',
            LCHEL: 'Ліч.ел.ен.(так/ні)',
            NPCHEL1: 'Ел.ен.(ПТМ)',
            NPCHEL2: 'Ел.ен.(ППМ)',
            LPRRESTR: 'Озн.рестр.(так/ні)',
            NKVT: 'Квт.-Год.',
            NPLLGOT: 'Сае.норма(м2)ОПАЛ.',
            NPLLGKV: 'Сан.норма(м2)КВАР.',
            NNORMAGV: 'Норма(м3)ГВ',
            NNORMAXV: 'Норма(м3)ХВ',
            NNORMAKAN: 'Норма(м3)канал.',
            NNORMAEL: 'Норма(квт.-год.)',
            LINDOTOP: 'Інд.опал.(так/ні)',
            LCHKANDN: 'Ліч.кан.(так/ні)',
            NNVODA: 'Норма по ХВ(для пільг)',
            NKOLKOM: 'К-ть кімнат',
            NKVTDOP: 'Дод.квт-год.',
            NKOLPR: 'К-ть прописаних',
            Actions: 'Дії',
          }
        }
      }
    }
  });

export default i18n;