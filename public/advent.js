"use strict";
(() => {
  const YEAR = 2026;
  const EARLY_OPEN_THROUGH = 4;

  const departments = {
    lessons: { name: "Для урока", short: "Урок", tone: "pine" },
    words: { name: "Хорошие слова", short: "Слова", tone: "crimson" },
    rest: { name: "Отдых", short: "Отдых", tone: "sage" },
    wins: { name: "Маленькие победы", short: "Победы", tone: "gold" }
  };

  const weeks = [
    { label: "1–4 декабря", start: 1, end: 4 },
    { label: "7–11 декабря", start: 7, end: 11 },
    { label: "14–18 декабря", start: 14, end: 18 },
    { label: "21–25 декабря", start: 21, end: 25 },
    { label: "28–30 декабря", start: 28, end: 30 }
  ];

  const winter = [
    "https://static.tildacdn.com/tila3834-3936-4339-a235-323736626631/Frame_2131328648.png",
    "https://static.tildacdn.com/tila3837-6637-4263-a636-326233643034/Frame_2131328649.png",
    "https://static.tildacdn.com/tila6231-3737-4537-b262-343761653362/Frame_2131328651.png",
    "https://static.tildacdn.com/tila3137-3639-4466-a563-356365643735/Frame_2131328652.png",
    "https://static.tildacdn.com/tila6530-3936-4562-b665-636138656565/Frame_2131328653.png"
  ];

  const backgrounds = [
    ["Зимний городок", "winter-1.jpg"],
    ["Заснеженные мосты", "winter-2.jpg"],
    ["Северное сияние", "winter-3.jpg"],
    ["Морозные узоры", "winter-4.jpg"],
    ["Зимний лес", "winter-5.jpg"]
  ];

  const cardCopy = {
    1: ["Спасибо, что вы рядом!", "Пусть в новом году будет больше поводов собой гордиться."],
    4: ["С Новым годом!", "Пусть будет время на то, что радует."]
  };

  const holidayEvents = [
    [1, "11:00", "Учительская с Надей Тажиной", "Как удержать концентрацию учеников перед новогодними праздниками?", "https://skymeet.ru/vk.ru/call/join/wtG4FCxsvTonbgYtVNdd9wxUAOBHaDp6ioOYBqwochM?utm_source=vk"],
    [3, "14:00", "Книжный клуб", "Лия Арден, «Невеста Ноября»", "https://skymeet.ru/vk.ru/call/join/gXa1HCG4i4evFy6wRkYWLvm-0QKqmUMkPQVt3Ns6uco"],
    [5, "12:00", "SkySpeak German with Marina Zhidkova", "Nikolaus, Krampus & Co. Woran haben wir als Kinder geglaubt?", "https://skymeet.ru/vk.ru/call/join/yfpTt9HB6bpUHSi1naFmTWtGqXJWdqTsI3RkjHwhQcU"],
    [7, "15:00", "SkySpeak French with Anastasiia Rybakova · A1–B1", "Les cadeaux", "https://skymeet.ru/vk.ru/call/join/nxQIn3noBFw7ux8qUzRaumU0w_LGl_0-X-aC8VhD_MY"],
    [8, "11:00", "Учительская с Надей Тажиной", "Планирование января: как мягко вернуть учеников в ритм после каникул", "https://skymeet.ru/vk.ru/call/join/8WerkOZ-CjkkF1RS9aEJSwmwLSntVRUKyqYC-T2i_5Q?utm_source=vk"],
    [16, "13:00", "Книжный клуб", "Нехудожественная литература", "https://skymeet.ru/vk.ru/call/join/PTx_W2CgG4eMPfqeKQWzdyzSrde62u3GhG1RkabBLWc"],
    [16, "17:00", "Teachers Breakroom with Anastasia Rybakova", "Managing Holiday Season: Practical Self-Care"],
    [18, "15:00–16:30", "Финал ЧГК", "", "https://skymeet.ru/skyeng.ru/go/max"],
    [20, "13:00", "Учительская с Надей Тажиной", "Тематический урок или нет? Как создать интересный рождественский урок для разных уровней?", "https://skymeet.ru/vk.ru/call/join/g6VjjFcTdQ75U0K9fl1-yIB7RBVuN-8h-f_6ZtVWeXw?utm_source=vk"],
    [21, "15:00", "SkySpeak French with Anastasiia Rybakova · A1–B1", "Les décorations et l’ambiance des fêtes", "https://skymeet.ru/vk.ru/call/join/nxQIn3noBFw7ux8qUzRaumU0w_LGl_0-X-aC8VhD_MY"],
    [22, "12:00", "Онлайн-утренник"],
    [23, "10:00", "Игры эрудитов", "Тематические настольные игры", "https://skymeet.ru/vk.ru/call/join/VVjm-oH2sh8nZMWwcg9YZE8xC8iIyFm2GqbLYt7G8EI?utm_source=vk"],
    [24, "12:00", "SkySpeak English with Viktoriia · A2+", "", "https://skymeet.ru/vk.ru/call/join/hINzkt1bOJmjGvS7ftZf4SEmkzlCvaekTabkTlCXT2M"],
    [24, "14:00", "SkySpeak Spanish with Elina · A2+", "Cantamos y jugamos juegos relacionados con la Navidad", "https://skymeet.ru/vk.ru/call/join/6eFLyEz9DZbv3HVJ7FON_5uVvbZ_nTEvjvZdi2stF2oh"],
    [26, "11:00", "SkySpeak English with Elina · B2+", "Playing games. New Year/Christmas edition", "https://skymeet.ru/vk.ru/call/join/6eFLyEz9DZbv3HVJ7FON_5uVvbZ_nTEvjvZdi2stF2o"],
    [26, "12:00", "SkySpeak German with Marina Zhidkova", "Feiertage: was tun, wenn nicht alles nach Plan läuft?", "https://skymeet.ru/vk.ru/call/join/yfpTt9HB6bpUHSi1naFmTWtGqXJWdqTsI3RkjHwhQcU"],
    [26, "18:00", "Клуб любителей японской культуры", "🎍 «С чистого листа: японское искусство встречать Новый год»", "https://skymeet.ru/vk.ru/call/join/EvMefAveHTmixD60sU2odk-HdXLGvKuUMiFOOBJkBZs"],
    [29, "12:00", "Учительская с Еленой Александровой", "Наши новогодние традиции", "https://skymeet.ru/skyeng-team.ktalk.ru/aipjtcgpsloc"],
    [30, "12:00", "SkySpeak German with Marina Zhidkova", "Entweder – oder? Winteredition. Ein gemütlicher Jahresausklang", "https://skymeet.ru/vk.ru/call/join/yfpTt9HB6bpUHSi1naFmTWtGqXJWdqTsI3RkjHwhQcU"]
  ];

  const wallpapersFolder = "https://disk.yandex.ru/d/EMrDO_V1-L90zA";
  const wallpaperPaths = {
    "ornaments-desktop": "/01 · Ёлочные шары с портретами.png",
    "ornaments-phone": "/01 · Ёлочные шары с портретами · Телефон.png",
    "parachute-desktop": "/05 · Дед Мороз с парашютом · Компьютер.png",
    "parachute-phone": "/05 · Дед Мороз с парашютом · Телефон.png",
    "rink-desktop": "/03 · Ледяной каток · Компьютер.png",
    "rink-phone": "/03 · Ледяной каток · Телефон.png",
    "train-desktop": "/06 · Зимний поезд · Компьютер.png",
    "train-phone": "/06 · Зимний поезд · Телефон.png",
    "village-desktop": "/02 · Снежная деревня · Компьютер.png",
    "village-phone": "/02 · Снежная деревня · Телефон.png"
  };

  const wallpaperDesigns = [
    ["Снежная деревня", "village", "UklGRjYEAABXRUJQVlA4ICoEAAAwFgCdASqWAGQAPrFOoU4nI6qpJZapyVAWCUAaESMaiCd30Y5W2A52j0pbx96AHSm/4RICzoBYb34KDHxqa5aXM9WEAXyagEzgan6DM0SwpEPc6pN0ewWqYKp4P37Fh4AnTyRn+IY9PXPV9yrj+ufMq0temQisB56ByN5BuMN8DXCLQapr2t2QjRIDviB82Z6E870OuBR0aVN/+qv/sx1Thx7YwG/eqZvT8W3BOPVmjUh3A5MaJzk0j/AA/ve0G40TI7vnJwAZ0wWUw0a+T1WLmCSSK3Nxv+4T2VPNL7p0CrbKqZMnwwgzv0UwoP6LJ517qf1ZJzZQuLhIDWhKIj8oJP4/we3iT+oC01LgJ6elULW6vIl8Rc7R8Z01wiuJHi+LD+QeoARuJHrIKhPhw+oQPKTWz40v2C+4gxiixjODBQJZWQ1WoY9ULd/oU+fqj7mwv08AHnOhcys4OJ8otgGufohkEH+9lgQtMXmJJDATP0KDDBOf6Oe0F/Kc+56tRiuirtkA2CfHWtOAs/bsx4LmFhqhrTO0kU97iNiPaW0uDmcJrjhOcXe00Gxg/z+2wzlLz5e14K78e9xbVErk0xj64vx9wil8G7ztBpSSWte/CXDEMqQaGA/6oR7bqhSE4WtK9yGdazo17FO78Tv7mFzrfyx3mYiA2DFbpYocGXVugUvlB7vgYM/B9aFkPfvWcCtWKW2Tj9uJWWUKXby3ToHz2VBDd+oQB1z6SDAusuJfpTFXNXBRjly/mg2UbSxW7ettcFOpQGxVZCU6v0AqCONpRY6l/p2eqbQC+LiUw9T0A2hez/14+ZQ1hK7MqN9I8gCWZdoRQrs8UM72syKq3l8PtRNsQQqcbfqS3IrXnEJ27LO+W5umrgYTUGAFazmWXP8rSL3s/0O9NxVEO/5Yh4MtQB9G9FHwSP52rkgqXYk0LspA4rPckD2Au5cyR8ugYNrexfH2zR96jN7z9Flbpkt8/Jl/FfwFYHcDjGbZ74TBU7yJpfMpu/pKaJRMyoG4XqeGg3Ja0IEwLi13YLMShKqKI6+1jict7ofeg1cpvYbZqXdBQr/7AkEGxpEYOfVrYnLxCtqJKaOtmohVWAYzYy8vo14ar0DeAyU0iPD9ZRw3XrsgNfrSvfQa1vqo42p1J9xMN8oxdrj22c5W1FOM/Up6bC1CduVpMPnVwKwjalPKU+cpQ74w8WLUKPO1KD7B/Vew2doefkhJ/8ZdFd1kmtuw8P+/mKsX47wi614al5BRCDQntJUJZEa7fOBO/mbSTs+xtjnxRMl1mTKg+OOZqDZETdyws60BevdEJZO69kKUb7lZjNyU364xMeJDpc8JJ8+ou2nepdz7eVbaowOP8f8NxFFDAbR/J6jREFH+U0Rz7KzcTWhFCzjzg55OSl0Giq33CYAAAAAAAAAA"],
    ["Ёлочные шары", "ornaments", "UklGRiwFAABXRUJQVlA4ICAFAAAwGgCdASqWAGQAPrFUo00nJKMiJZv58OAWCUAakJ2vpF+r5+st6v9tv5lP2U9XLogOqA9ADpfvKA1ZXa1k9B3G13Dy4tNU0iPJ78wb1IXSDd/mCw91dpKf7sBGsEeSFyIK4x8g8jdlh2dUM2SIAVvMItagMd70p+YSbiO8APQBmnAUbico+lSP8bFk410t7TVQlzjrS3RpY6KG/HaPvGjzjUPMDtZn47fsdrjFZGIWgqAi8TsfEWzDSPmfvfksStRrzlLSqoghEtx6oXneUa1zKbz56xxvyiEaRAD+9tIEswl+SHJdo4CmdeC4eTBrP5dwHMgUZaftvkwLIYNsTlQ4rQwwRurRRxUi2u6oldLBaeyptIsmr7FPERxQBN3quSmtsYsUqhLbioLEE/nq/fCkHoqo+16ezU5m9fshdRUc+UAvqh1sCUDmfAzPx4HKsvuif8aQMnbdxYSbzmGnwyZNMt2rsaqjE4WC54qjwoU3hGHWjB7EMiLZkGpz2byYpBE8Xl2ghjyJ1Qu7rGZdK1PycGa/+C4KT2TvjG1DF5fpmdfS3ydaKAqosmYgg3uRO/5i9Y95iUBoW5jPSEZmw7y7ySsNQTlm824MOjt6KG1sU7b+UU6rVDlyCUTzZqK9iPEpJzTPdKNgOln86RNZxTmdEW+HucwngojP9b/Zd8ImnpEWyraMXvAwnfL16qPaR0FeNP3hUc2K7uJOcwULykE5f2gA0F9BkI6uFm7x8LHC4PiCsA9tZO3HxjK+jbyd567BSbVsohn8oDolhh0hESVSDDcx4Bz0W/q3JDDm7cbfOW6fvkKNQgBBePn0geZ6HUgoaR7bXZEXSyJnu0gRsC/Oqw7FkqdG9fM86RSOMB2U4ZEWlkG++l4YMnfhcXV5Ot0eWpbkuJcZe7whjw90fgnw0LBSr1/94Z0d2d1lohnCKakevi6dnPWOlJo1dG4HOLKKspauMaCk4UFrNNeU31eHs2V4wGXQRX7GX5wpqfEu7T7PSeyPVOEW/fybVauFH97NCEmU1S93r8uSUHwV1K6sPM/sfcDLpY+bqcK70YLm08rrbAmF868tGzwymdq48qxujeFozBGCQSJCQmdhDfGNmfTMAXdPSByoNRqWK3Hc8Xw1sjiKtJkMDToFkKOKC5toy7Xs0GQAyyccJqhrx3KJQ+Vjm0CgQi9Y2soEVBmh2aUxemqdmvVOXXZcbDVYnEBv8EocxRLEWiOCzKaBC7N6XJS1rhlsqt05jqLgvEP794yUIG7dMkqBcLmjaHuhrd7OiIcZCTs7ffBNhQlLW4RkswD9zb/NQradJD1kiTn07DzECA0uHXUN/XT/MlRPmR1MHSufCJTI26U6kSYAeh7CZpYIfwUelv5u0fLBjbZs40/1RlevF6FNEe3reAozFS5hS4cLWq97/w/Uk4nSvEuPbhcodjVBDNGMMNQRJsB1YkurMpiv6n+SqGQYJdEBwcoSnRhQLtQyJ4B15gkkWgMVNMCHsbN8qHzZX1G5bYoJxSXVQQZFbm7PelHOFvoOxad2tZ0Faq0H5VvKW2wRtej1RAcu+SHOFBghY7qchNJic5I6LmQYYMntmrUlHC4DCo30h5ISVXszTpyv+BDL78n7ERJudJIs0h16KThgsVBcBML6YK1ShFEq9GyHohG/v/HebWSLnHtH3ttjJkNjwzRJhTbHWfJ4gT6/LnVdrdF8ckzDR31tU8r2q0gUhFUcNw3YBBo8akL0+gQADFeAAAAA"],
    ["Ледяной каток", "rink", "UklGRnICAABXRUJQVlA4IGYCAACQDwCdASqWAGQAPrFYpE4nJSOiJRXZGOAWCWctloqA3QOYkHYf3LJYSTjryAKSp4JhYhTA3/gADLc7Wu/0nj3mxFYtX2pk4qtI7UrAP4b5OF5niAN0kE8mJtJbho6rC/peeWMExUPKEPndvWb5qYAeHF0L2hb5ou7oln6fulwHK0MWdnnAAP72Vdqih+TS43yBqrgB7LYX42yF287iNvpQw1HlyGTNPd6TCuFMvcvM3ha1p1APUewnECnvalg23w0K1OB73QttFiWS+c0SYU9Fquw9ojyr8LML49m7yaxVgaL7XWi77NMblXGdau03UZ2LIS7WtsO2xCo0xEsYTO6eRcdn7xh4akw8BEHdFULidb+f3cor3BMBrJJUrKX2Rfd2pD3jqkVwRc++8H9TRXwfW8VBz1wQ4Y2gb30e3RtOhBHYs8y4NbIsO/1WIYTHbcbbh2GzftXWOcrSh2X+gP+zVXuaKXzCn2BAxlukw8jQom/YiHly+TrnLNlCB28JB9ZKEiv/8AhB4F6mSiuYBED6I5NSpfqQ1NRgzzkO8W9MINpw2M/IrlXI9o5RplR4RnnCqmqFYg52fejCsTff0HHBfSqTVMsR5ybwQ81DlKmVARTSzzgckjI0IND8A2MGvXE9i42dAEI8bs2+BqspCGgGdX5kGPkxiMEK9g34uSPp/XYxFuVLLT7SwTAnlkIdxXikSIPH9uKLvp/dJ+p/O6VsQb55S+NNIbZJcAnOnGTNqo+Qn9OopSH6/UGzb9HdttuKM4tPOlazd+rdwLCwxKQC+nIzFO5PmbGGzkZj72TNUAAAAAAAAA=="],
    ["Зимний поезд", "train", "UklGRmwDAABXRUJQVlA4IGADAAAQGACdASqWAGQAPrFSo0snJSOhpnkr2OAWCWUA0or7/VRhQ/n/n8VPsuDr41vPtnMe3kDkrM6q1YAUg1uegnWHAGo9UKfzoxJeMq8Csnuozdi5tpo2awFVGO93eTuiE6sCeQ8GHRP1GE3G6Z+ods01f2/7ZWD+fNw8ld1YW5y4VJj1ZoRULaSsa/uWeAaIkeExGrzY2HCbc26nJB7EysAEJGBtWe5X7vSlMjJj5NKqsV2uo2qgWiDBMKt2ouqZ1DfhHZXsDofzmAAA/vbSBCbsO4HMGAD30p2Tt3578mkdaezqu9XeVUKBssSbdFJAj558+aEIpxe7MfhekBTaxD8rHTsP7de/5n/vykYefgnWqn/OG7B7oSR5EgD22CGvt4+VPb2Mvw/5qmb+kKf/5Xl/yeoqFY2BufVmMAVLjuF1goBXg0P4kQZv/EozYaJMBtERE8bOkgrE+JwpjePZCBpxP2c6JIaE8vBci1EsOuAyvbmrzZqjXEJwVMgusb+Ki+kdjSswtnh9D/xBr+0NkxOTLVqycwBPIEirxdWrfWBJ/joI+AzZYDz5LYAGagpf1HfJapvzF8co3QyENo/JXPA25RMwWIrv2h8PGx8fdpJIfeOAUx6Twt7K3rn9j2M2cX1BJx9RPJVzPz5eOtnsPUXF+vWQfGDKk1HEmlk8058frACNEhyInpeTiNfE/CK93BbsILfCgeQ/QcNxhckt1vlsqxthNiRnUMl+QHEBja6cvGF1+/Eqevna/AOUtLkO5Qq/EefcnMsoxVkhpho2hvCNvl21HpNlsVJoYf0F1ueSbvltvSLdr1d5ZU2wU75fps5fV4qwgO9QUj9e9FzHQrLebAirT83HO0mg6WD8gJXSOr/uD0r3f5gsgn030ql+5m2PK9WES90stJ31EjhEXhaFwMRkjBraf45/VEzKmrcPzHbFJVWwmPtHn4eSW5PUIrqACrnnb/3FbsxH5TXmXzeVeVpPfLUcDb1TZGqrwQ49vJcbBoL0oBuiTEVnKC6zDkDXzs+nOTUBAPataYGxLzX4AAIN3z1lO+KXNiT/of6LmDRKq51WKWbuPYmXOm6i7EfuEhyGlcckeOdEG0kgcHEiapw5CmgcJ/YCNr89v5axhR+DsTTmYzX1qMAAAAAAAAA="],
    ["Дед Мороз с парашютом", "parachute", "UklGRr4DAABXRUJQVlA4ILIDAABQFwCdASqWAGQAPrFWpU2nJKOiI1baaOAWCUAaPZS6MI98NLb2bl/eUPQr6WXIYKphpMbrxFV3GZm+Iz6/BfVGQFWxzLUxEstRabf3MA/A2CI5fiVws11EjwsnBF0S1iwwEE6M13krylgwF3j1T/K9dC6huEq9lcwiLpTkwTXVYkNoItE8OFreRLE/fJ22ljJVpLh4ShQWki9+SvbqJoYbmX75HbBM2xT2QoUGx0owYrMW1giRK5wKVvlW7BHzBt27zCgA/vXPuqpxCwT0megdUiK8+XEcWMHQX8NOvDpHpuWvMcmPBAvSn0M8+2uA1WpVZewItaAZ1aGmyKvn7RHykEbYrYRpfjEz8FHrcF+rsxqN4uPN7Z+gAoAVm/KnZijPN3S3VFW5fHPvYe9VwQ5DClHOiyAZuRzpHvFfJOD2Vk+d0KMqElgU92baxAHQHTFsz/uNZn/Y7U9zAYr+hjDpo3ueqsBT0ZgVCkqly2CcU1tSJVYR/eWEnkz1XVJoRI55QK+zN6gi7720tQB8I4ab1282EiI8we8rK2T/j1yCHDWmGTLLVVuYW8VVwEbW2+tbDNHd/NOWR3v8w8g1uoc5DB68f8oQOFwn6I/rv0T/mvy6XqseTAaIoUy94OXvI4qaFupcqOTPShnlEzHGgOoQ4E11q0CtWSHja451/+VvskPu8EVeHeCoVU+w5XuUpUF4ZZ7HjeyYHRzmEWN5cRM+0bTFftQ4nGFtbT9m3zG/gMPNxkzdTnEhB+QfBDs+x5SPXjUX9aHOF8apnYv7hB0FvuKNA8izg2uOn0aC9vGdYWXLIUtOp4MSkWe5MSi2D/v5n3kw0nUO6foTTfAF0tILxfCeKdgAKIChxdfUYJl+DI5NKIOMv6NTXpelzt6Y6Im3w3dDjmqtqTjJKM2xvwNG/u7UXw3t+KWocmJuvBnm6QAYTYcrIsgGJEYebM2TSzD/gSZYNbPxqkmf1p8KFlcif7Hnvt1m/z/uFBpI7P6YbgLvwsSlEEYuEmFlF7xLaQ06fv2yf9J37AX171CRHWiYJS3hLJ0sw3RvRnLX+NR6ghEcFuMVPzxdLqe6yfTdY0KJ/GczzkOFixKTxRwFjfEygNKCHTeDTgpJjKj+xuLU65NzsUc6gU8rnCOE63YXEsgV8Aysbs3BlclprzNRiikQW+iPyxm4nZ1XOjwMCKRTBIvRpRCbABAIX4Ohj0WT2HHK9Ey7rbVjv8fLgOZ8DXVUs2VNxRqDvcbHrDWvXQgAAAAA"]
  ];

  const expertWallpapers = [
    ["Зимние обои 1", "/1.PNG", "✨"],
    ["Зимние обои 2", "/2.PNG", "✨"],
    ["Зимние обои 3", "/3.PNG", "✨"],
    ["Зимние обои 4", "/4.PNG", "✨"],
    ["Зимние обои 5", "/5.PNG", "✨"],
    ["Зимние обои 6", "/6.PNG", "✨"],
    ["Козлик и зимняя вязка", "/Kuscheliger blauer Winterstrick mit Alpaka.png", "🐐"],
    ["Ледяная пещера и снежный козлик", "/Magische Eishöhle mit blauem Schneewesen.png", "🐐"],
    ["Кристальная пещера и синий талисман", "/Magische Eiskristallhöhle mit blauem Maskottchen.png", "❄️"],
    ["Зимний рассвет и пушистый талисман", "/Зимний рассвет и пушистый талисман.png", "❄️"],
    ["Зимний фон с огоньками и козликом", "/Зимний фон с огоньками и альпакой.png", "🐐"],
    ["Праздничный козлик под фейерверками", "/Праздничный козлик под фейерверками.png", "🐐"],
    ["Пушистый синий козлик на санях", "/Пушистый синий зверёк на санях.png", "🐐"],
    ["Синий козлик под северным сиянием", "/Синий козлик под сиянием северного сияния.png", "🐐"],
    ["Синий помощник украшает снежную ёлку", "/Синий помощник украшает снежную ёлку.png", "🎄"],
    ["Снежная игра синего пушистика", "/Снежная игра синего пушистика.png", "❄️"],
    ["Снежный талисман и снеговик", "/Снежный талисман и снеговик.png", "⛄"],
    ["Уютный зимний уголок с талисманом", "/Уютный зимний уголок с пушистым талисманом.png", "✨"]
  ];

  const entries = {
    1: { short: "Открытие", title: "Министерство открыто!", dept: "wins", welcome: true, text: "С наступающим Новым годом! Спасибо, что помогаете ученикам разобраться в сложном и замечаете их маленькие победы. Пусть в новом году будет больше поводов радоваться тому, что получилось у вас и у ваших учеников.\n\nЗдесь собраны идеи для уроков, расписание новогодних встреч, фоны, открытки и подсказки, как подвести итоги года вместе с учениками." },
    2: { short: "События", title: "Расписание новогодних событий", dept: "rest", text: "В декабре встречаемся в Учительской, книжном клубе, на разговорных встречах и играх. Выберите событие и подключайтесь по ссылке.", events: holidayEvents },
    3: { short: "Обои", title: "Фоны для телефона и компьютера", dept: "rest", text: "Выберите обои, чтобы открыть изображение в хорошем качестве на Яндекс Диске.", wallpapers: true },
    4: { short: "Плейлист", title: "Новогодний плейлист Олега", dept: "rest", text: "Музыка для перерыва между занятиями или зимней прогулки. Ссылка на плейлист в Яндекс Музыке появится здесь." },
    7: { short: "Разминка", title: "Зимняя разминка для урока", dept: "lessons", text: "Попросите ученика описать зимний предмет тремя подсказками, а сами попробуйте его угадать. Потом поменяйтесь ролями. Можно использовать слова и темы, которые вы уже проходили." },
    8: { short: "Фоны", title: "Фоны для видеозвонков", dept: "rest", text: "Скачайте понравившийся фон и добавьте его в настройках видеозвонка. Проверьте, как он выглядит, до начала занятия.", downloads: backgrounds },
    9: { short: "Находки", title: "Материалы для уроков", dept: "lessons", text: "Собрали 38 проверенных интерактивных ресурсов для занятий вне платформы в Библиотеке находок.", route: "#library", linkLabel: "Открыть Библиотеку находок →" },
    10: { short: "Уроки", title: "Новогодние уроки на платформе", dept: "lessons", text: "Новогодние и рождественские уроки прошлых лет можно найти в каталоге на платформе. Ссылки на новые уроки пока уточняются." },
    11: { short: "Советы", title: "Советы методистов", dept: "lessons", text: "Как подвести итоги года вместе с учеником? Попробуйте начать с вопроса «Что вы теперь можете сделать сами?» и вспомните вместе конкретный пример." },
    14: { short: "Заметка", title: "Заметка ученику", dept: "words", text: "Напишите ученику, какой момент с занятий вам запомнился. Назовите конкретное действие, которое заметили, и скажите, чему оно помогло." },
    15: { short: "Открытки", title: "Новогодние открытки", dept: "words", text: "Скачайте готовую открытку или соберите свою собственную в нашей Мастерской открыток.", route: "postcards.html", linkLabel: "✨ Сделать открытку →", downloads: [["Спасибо, что вы рядом!", "card-1.jpg"], ["С Новым годом!", "card-4.jpg"]] },
    16: { short: "Баланс", title: "Советы психологов", dept: "rest", text: "Здесь запланированы рекомендации психологов о том, как мягко завершить год. Ссылка пока уточняется." },
    17: { short: "Анонс", title: "Анонс итоговой встречи", dept: "words", text: "Итоговая встреча — повод поблагодарить друг друга и вспомнить, что получилось за год. Дату, время и формат ещё согласовывают." },
    18: { short: "Добро", title: "Благотворительная подборка", dept: "words", text: "В Бюро добрых дел мы собрали проверенные акции, где можно поддержать детей и семьи перед праздником.", route: "#bureau", linkLabel: "Перейти в Бюро добрых дел →" },
    21: { short: "Идея года", title: "Одна находка за год", dept: "wins", text: "Какое объяснение, задание или вопрос особенно помогли вашим ученикам в этом году? Сохраните эту идею и пример, с которым она сработала." },
    22: { short: "Слова", title: "Добрые слова для встречи", dept: "words", text: "Если хотите поздравить коллег на итоговой встрече, начните с одного предложения: за что вы благодарны сообществу преподавателей в этом году?" },
    23: { short: "Встреча", title: "Итоговая встреча", dept: "words", text: "Здесь запланированы подробности итоговой встречи. Дату, время и ссылку встречи ещё согласовывают." },
    24: { short: "Мечта", title: "Фраза, с которой хочется начать", dept: "lessons", text: "Предложите ученику закончить фразу «В новом году я хочу попробовать…». Запишите ответ вместе, чтобы вернуться к нему на первом занятии после праздников." },
    25: { short: "Пауза", title: "День без спешки", dept: "rest", text: "Выберите одно небольшое дело для себя, на которое сегодня есть время: прогуляться, почитать или послушать любимую песню." },
    28: { short: "Привычка", title: "Что взять с собой в новый год", dept: "rest", text: "Выберите одну привычку, которая помогала вам чувствовать себя лучше между занятиями. Запишите, когда вам удобно повторить её в январе." },
    29: { short: "Итоги", title: "Ваши личные итоги", dept: "wins", text: "В этой карточке запланированы персональные истории с итогами года. Пока можно собрать свою короткую заметку: чему вы научились, кому помогли и какой момент хотите запомнить." },
    30: { short: "Дайджест", title: "Новогодний дайджест", dept: "wins", text: "Финальный выпуск запланирован на 30 декабря. А все материалы и активности декабря всегда доступны в Мастерской.", route: "#workshop", linkLabel: "Заглянуть в Мастерскую →" }
  };

  const totalCount = Object.keys(entries).length;
  const moscowFmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Moscow", year: "numeric", month: "2-digit", day: "2-digit"
  });
  const moscowDate = () => {
    const p = Object.fromEntries(moscowFmt.formatToParts().map(x => [x.type, x.value]));
    return `${p.year}-${p.month}-${p.day}`;
  };
  const isPreview = () => location.search.includes("preview=1") || location.hash.includes("preview=1");
  const releaseDate = day => `${YEAR}-12-${String(day).padStart(2, "0")}`;
  const isOpen = day => isPreview() || day <= EARLY_OPEN_THROUGH || moscowDate() >= releaseDate(day);
  const esc = v => String(v).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const wallpaperUrl = path => `${wallpapersFolder}/${encodeURIComponent(path.slice(1))}`;

  let activeFilter = "";

  async function pictureBlob(file, picture) {
    const response = await fetch(picture);
    if (!response.ok) throw new Error("Фон недоступен");
    const background = await response.blob();
    if (file.startsWith("winter")) return background;

    const image = await createImageBitmap(background);
    const canvas = document.createElement("canvas");
    const phone = file.startsWith("phone");
    canvas.width = phone ? 1080 : 1200;
    canvas.height = phone ? 1920 : 667;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const height = Math.round(image.height * canvas.width / image.width);
    ctx.drawImage(image, 0, canvas.height - height, canvas.width, height);
    image.close();

    if (!phone) {
      const [headline, message] = cardCopy[Number(file.match(/-(\d+)/)[1])];
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#243ab7";
      ctx.font = "bold 76px Arial, sans-serif";
      ctx.fillText(headline, 600, 292, 990);
      ctx.fillStyle = "#354c78";
      ctx.font = "32px Arial, sans-serif";
      ctx.fillText(message, 600, 405, 990);
    }

    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error("Ошибка сохранения")), "image/jpeg", 0.91);
    });
  }

  function renderScheduleHtml(events) {
    let prevDay;
    const groups = [];
    for (const [day, time, title, topic, url] of events) {
      if (day !== prevDay) {
        groups.push({ day, items: [] });
        prevDay = day;
      }
      groups[groups.length - 1].items.push({ time, title, topic, url });
    }
    return `<div class="advent-events">${groups.map(g => `
      <div class="advent-event-group">
        <span class="date">${g.day} декабря</span>
        ${g.items.map(ev => `<div class="advent-event">
          <span class="advent-event-time">${esc(ev.time)}</span>
          <div class="advent-event-info">
            <strong>${esc(ev.title)}</strong>
            ${ev.topic ? `<p>${esc(ev.topic)}</p>` : ""}
          </div>
          ${ev.url
            ? `<a class="button advent-event-join" href="${esc(ev.url)}" target="_blank" rel="noopener noreferrer">Войти ↗</a>`
            : `<span class="advent-event-pending">Скоро ссылка</span>`}
        </div>`).join("")}
      </div>`).join("")}</div>`;
  }

  function renderWallpapersHtml() {
    const cards = wallpaperDesigns.map(([name, slug, thumb]) => `
      <div class="advent-wp-card">
        <img src="data:image/webp;base64,${thumb}" alt="" loading="lazy">
        <div class="advent-wp-title">${esc(name)}</div>
        <div class="advent-wp-links">
          <a class="button secondary" href="${esc(wallpaperUrl(wallpaperPaths[`${slug}-phone`]))}" target="_blank" rel="noopener noreferrer">Телефон ↗</a>
          <a class="button" href="${esc(wallpaperUrl(wallpaperPaths[`${slug}-desktop`]))}" target="_blank" rel="noopener noreferrer">ПК ↗</a>
        </div>
      </div>`).join("");

    const expertCards = expertWallpapers.map(([label, path, icon]) =>
      `<a class="advent-expert-item" href="${esc(wallpaperUrl(path))}" target="_blank" rel="noopener noreferrer">
        <span class="advent-expert-ico" aria-hidden="true">${icon || "✨"}</span>
        <span class="advent-expert-name">${esc(label)}</span>
        <span class="advent-expert-go">↗</span>
      </a>`
    ).join("");

    return `<div class="advent-wallpapers">${cards}</div>
      <section class="advent-expert-section">
        <div class="advent-expert-head">
          <div>
            <span class="eyebrow-dark">Особая подборка · ${expertWallpapers.length} фонов</span>
            <h3>Обои от эксперта Сергея Смягликова</h3>
          </div>
        </div>
        <div class="advent-expert-grid">${expertCards}</div>
      </section>
      <div class="actions" style="justify-content:center;margin-top:14px"><a class="button cream" href="${wallpapersFolder}" target="_blank" rel="noopener noreferrer">Открыть всю папку на Яндекс Диске ↗</a></div>`;
  }

  function renderWeeksHtml() {
    const today = moscowDate();
    const lockSvg = `<svg class="advent-lock" viewBox="0 0 16 16" fill="none"><rect x="3" y="7" width="10" height="7" rx="1.8" stroke="currentColor" stroke-width="1.5"/><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" stroke="currentColor" stroke-width="1.5"/></svg>`;

    return weeks.map((w, idx) => {
      const daysHtml = [];
      for (let d = w.start; d <= w.end; d++) {
        const entry = entries[d];
        if (!entry || (activeFilter && activeFilter !== entry.dept)) continue;
        const open = isOpen(d);
        const isToday = !isPreview() && today === releaseDate(d);
        const special = [1, 2, 15, 18, 24, 30].includes(d);
        const dept = departments[entry.dept];

        const sealHtml = `<span class="advent-seal-wrap" aria-hidden="true">
          <img class="advent-mini-seal" src="assets/decorations/wax-seal-snowflake.png" alt="" onerror="if(!this.dataset.fb){this.dataset.fb=1;this.src='assets/decorations/wax-seal-snowflake.webp';}else{this.remove();}">
        </span>`;

        const innerContent = open
          ? `${sealHtml}
            <span class="advent-open-num">${String(d).padStart(2, "0")}</span>
            <span class="advent-day-title">${esc(entry.short || entry.title)}</span>`
          : `${sealHtml}
            <span class="advent-num">${String(d).padStart(2, "0")}</span>
            <span class="advent-lock-corner" aria-hidden="true">${lockSvg}</span>
            ${special ? '<span class="advent-star-corner" aria-hidden="true">✦</span>' : ""}`;

        daysHtml.push(`<button type="button" class="advent-day ${open ? "is-open" : "is-locked"}${isToday ? " is-today" : ""}${special ? " is-special" : ""}" data-advent-day="${d}" data-tone="${dept.tone}" aria-label="${d} декабря. ${open ? esc(entry.title) : "Карточка откроется " + d + " декабря"}">
          ${innerContent}
        </button>`);
      }
      if (!daysHtml.length) return "";
      return `<div class="advent-week">
        <div class="advent-week-head"><strong>${idx + 1}-я неделя</strong><span>${w.label}</span></div>
        <div class="advent-days">${daysHtml.join("")}</div>
      </div>`;
    }).join("");
  }

  function openDayModal(day) {
    const modal = document.querySelector("#png-modal");
    if (!modal) return;
    const entry = entries[day];
    if (!entry) return;
    const open = isOpen(day);
    const dept = departments[entry.dept];
    const decorName = open ? "wax-seal-snowflake" : "sealed-envelope";
    const isWide = open && (entry.events || entry.wallpapers);

    let extraHtml = "";
    if (open && entry.events) extraHtml += renderScheduleHtml(entry.events);
    if (open && entry.wallpapers) extraHtml += renderWallpapersHtml();
    if (open && entry.downloads) {
      extraHtml += `<div class="advent-downloads">${entry.downloads.map(([label, file]) => {
        const pic = winter[Number(file.match(/-(\d+)/)[1]) - 1];
        return `<a class="advent-dl" href="${pic}" data-dl-file="${esc(file)}" data-dl-pic="${pic}">
          <img src="${pic}" alt="">
          <span>${esc(label)} ↓</span>
        </a>`;
      }).join("")}</div><p class="note" id="advent-dl-status"></p>`;
    }

    let actionHtml = "";
    if (open && entry.welcome) {
      actionHtml = `<button type="button" class="button red" id="advent-open-schedule">Открыть расписание событий</button>`;
    } else if (open && entry.route) {
      actionHtml = `<a class="button red" href="${esc(entry.route)}" id="advent-route-link">${esc(entry.linkLabel || "Открыть")}</a>`;
    }

    const bodyText = open
      ? entry.text.split("\n\n").map(p => `<p style="margin-top:10px;text-align:left">${esc(p)}</p>`).join("")
      : `<p style="margin-top:12px;text-align:center">Эта карточка откроется ${day} декабря в 00:01 по Москве.</p>`;

    modal.innerHTML = `<div class="modal-card advent-modal${isWide ? " is-wide" : ""}">
      <button type="button" class="modal-close" id="close-advent-x" aria-label="Закрыть">×</button>
      <div class="advent-modal-scroll">
        <img class="advent-modal-decor" src="assets/decorations/${decorName}.png" alt="" hidden onload="this.hidden=false" onerror="if(!this.dataset.fb){this.dataset.fb=1;this.src='assets/decorations/${decorName}.webp';}else{this.remove();}">
        <span class="eyebrow-dark">${day} декабря${open ? ` · ${esc(dept.name)}` : ""}</span>
        <h2 id="png-modal-title" style="margin-top:6px">${open ? esc(entry.title) : "Карточка пока закрыта"}</h2>
        ${bodyText}
        ${extraHtml}
        <div class="modal-actions">
          ${actionHtml}
          <button type="button" class="button secondary" id="close-advent-modal">Закрыть</button>
        </div>
      </div>
    </div>`;
    modal.hidden = false;

    const closeAll = () => { modal.hidden = true; modal.innerHTML = ""; };
    document.querySelector("#close-advent-modal").addEventListener("click", closeAll);
    document.querySelector("#close-advent-x").addEventListener("click", closeAll);

    const schedBtn = document.querySelector("#advent-open-schedule");
    if (schedBtn) schedBtn.addEventListener("click", () => openDayModal(2));

    const routeLink = document.querySelector("#advent-route-link");
    if (routeLink && entry.route?.startsWith("#")) {
      routeLink.addEventListener("click", closeAll);
    }

    modal.querySelectorAll("[data-dl-file]").forEach(link => {
      link.addEventListener("click", async e => {
        e.preventDefault();
        const status = document.querySelector("#advent-dl-status");
        const file = link.dataset.dlFile;
        const pic = link.dataset.dlPic;
        status.textContent = "Готовим картинку…";
        try {
          const blob = await pictureBlob(file, pic);
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = file.startsWith("winter") ? file.replace(".jpg", ".png") : file;
          document.body.append(a);
          a.click();
          a.remove();
          setTimeout(() => URL.revokeObjectURL(url), 15000);
          status.textContent = "Файл сохранён!";
        } catch {
          window.open(pic, "_blank", "noopener,noreferrer");
          status.textContent = "Открыли картинку в новой вкладке для сохранения.";
        }
      });
    });
  }

  window.MinistryAdvent = {
    openDay: openDayModal,

    renderHtml() {
      const openCount = Object.keys(entries).filter(d => isOpen(Number(d))).length;
      const statusText = `Открыто ${openCount} из ${totalCount}`;
      const filtersHtml = [
        `<button type="button" class="filter" data-advent-filter="" aria-pressed="${activeFilter === ""}">Все</button>`,
        ...Object.entries(departments).map(([id, d]) =>
          `<button type="button" class="filter" data-advent-filter="${id}" aria-pressed="${activeFilter === id}">${esc(d.short)}</button>`
        )
      ].join("");

      return `<section class="card-panel advent-panel" id="advent">
        <div class="advent-banner-wrap">
          <img class="advent-banner-img" src="assets/scenes/advent-banner.webp" alt="Новогодний адвент-шкафчик Министерства" onerror="if(!this.dataset.fb){this.dataset.fb=1;this.src='assets/scenes/advent-banner.png';}else{this.parentElement.remove();}">
        </div>
        <div class="advent-body">
          <div class="advent-head-ornate">
            <img class="advent-title-img" src="assets/scenes/advent-title.png" alt="Адвент-календарь" onerror="if(!this.dataset.fb){this.dataset.fb=1;this.src='assets/scenes/advent-title.webp';}else{this.hidden=true;this.nextElementSibling.hidden=false;}">
            <div class="advent-title-row" hidden>
              <span class="advent-rule" aria-hidden="true"></span>
              <h2>Адвент-календарь</h2>
              <span class="advent-rule" aria-hidden="true"></span>
            </div>
            <span class="advent-status-pill" id="advent-status">${statusText}</span>
            <p class="advent-lead">Новые карточки открываются по будням — идеи, встречи и тёплые находки</p>
          </div>
          <div class="filters advent-filters" aria-label="Отделы календаря">${filtersHtml}</div>
          <div id="advent-weeks">${renderWeeksHtml()}</div>
        </div>
      </section>`;
    },

    bind() {
      const root = document.querySelector("#advent");
      if (!root) return;

      root.addEventListener("click", e => {
        const fBtn = e.target.closest("[data-advent-filter]");
        if (fBtn) {
          activeFilter = fBtn.dataset.adventFilter;
          root.querySelectorAll("[data-advent-filter]").forEach(b =>
            b.setAttribute("aria-pressed", String(b.dataset.adventFilter === activeFilter))
          );
          const weeksEl = root.querySelector("#advent-weeks");
          if (weeksEl) weeksEl.innerHTML = renderWeeksHtml();
          return;
        }
        const dayBtn = e.target.closest("[data-advent-day]");
        if (dayBtn) openDayModal(Number(dayBtn.dataset.adventDay));
      });
    }
  };
})();
