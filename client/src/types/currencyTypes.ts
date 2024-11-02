const currencySymbols: { [key: string]: string } = {
    AED: 'د.إ',
    AFN: '؋',
    ALL: 'L',
    AMD: '֏',
    ANG: 'ƒ',
    AOA: 'Kz',
    ARS: '$',
    AUD: 'A$',
    AWG: 'ƒ',
    AZN: '₼',
    BAM: 'KM',
    BBD: '$',
    BDT: '৳',
    BGN: 'лв',
    BHD: 'ب.د',
    BIF: 'Fr',
    BMD: '$',
    BND: 'B$',
    BOB: 'Bs.',
    BRL: 'R$',
    BSD: '$',
    BTN: 'Nu.',
    BWP: 'P',
    BYN: 'Br',
    BZD: 'BZ$',
    CAD: 'C$',
    CDF: 'Fr',
    CHF: 'CHF',
    CLP: '$',
    CNY: '¥',
    COP: '$',
    CRC: '₡',
    CUP: '₱',
    CVE: '$',
    CZK: 'Kč',
    DJF: 'Fr',
    DKK: 'kr',
    DOP: 'RD$',
    DZD: 'د.ج',
    EGP: 'ج.م',
    ERN: 'Nakfa',
    ETB: 'Br',
    EUR: '€',
    FJD: 'FJ$',
    FKP: '£',
    FOK: 'kr',
    GBP: '£',
    GEL: '₾',
    GGP: '£',
    GHS: '₵',
    GIP: '£',
    GMD: 'D',
    GNF: 'Fr',
    GTQ: 'Q',
    GYD: 'G$',
    HKD: 'HK$',
    HNL: 'L',
    HRK: 'kn',
    HTG: 'G',
    HUF: 'Ft',
    IDR: 'Rp',
    ILS: '₪',
    IMP: '£',
    INR: '₹',
    IQD: 'ع.د',
    IRR: '﷼',
    ISK: 'kr',
    JEP: '£',
    JMD: 'J$',
    JOD: 'د.أ',
    JPY: '¥',
    KES: 'Ksh',
    KGS: 'лв',
    KHR: '៛',
    KID: 'A$',
    KMF: 'Fr',
    KRW: '₩',
    KWD: 'د.ك',
    KYD: 'CI$',
    KZT: '₸',
    LAK: '₭',
    LBP: 'ل.ل',
    LKR: 'Rs',
    LRD: '$',
    LSL: 'M',
    LYD: 'ل.د',
    MAD: 'د.م.',
    MDL: 'L',
    MGA: 'Ar',
    MKD: 'ден',
    MMK: 'K',
    MNT: '₮',
    MOP: 'P',
    MRU: 'UM',
    MUR: '₨',
    MVR: 'Rf',
    MWK: 'MK',
    MXN: '$',
    MYR: 'RM',
    MZN: 'MT',
    NAD: 'N$',
    NGN: '₦',
    NIO: 'C$',
    NOK: 'kr',
    NPR: 'Rs',
    NZD: 'NZ$',
    OMR: 'ر.ع.',
    PAB: 'B/.',
    PEN: 'S/',
    PGK: 'K',
    PHP: '₱',
    PKR: 'Rs',
    PLN: 'zł',
    PYG: '₲',
    QAR: 'ر.ق',
    RON: 'lei',
    RSD: 'дин.',
    RUB: '₽',
    RWF: 'FRw',
    SAR: 'ر.س',
    SBD: 'SI$',
    SCR: '₨',
    SDG: 'ج.س.',
    SEK: 'kr',
    SGD: 'S$',
    SHP: '£',
    SLE: 'Le',
    SLL: 'Le',
    SOS: 'S',
    SRD: '$',
    SSP: '£',
    STN: 'Db',
    SYP: 'ل.س',
    SZL: 'E',
    THB: '฿',
    TJS: 'SM',
    TMT: 'm',
    TND: 'د.ت',
    TOP: 'T$',
    TRY: '₺',
    TTD: 'TT$',
    TVD: 'A$',
    TWD: 'NT$',
    TZS: 'TSh',
    UAH: '₴',
    UGX: 'USh',
    UYU: '$U',
    UZS: 'лв',
    VES: 'Bs.S.',
    VND: '₫',
    VUV: 'Vt',
    WST: 'T',
    XAF: 'FCFA',
    XCD: '$',
    XDR: 'SDR',
    XOF: 'CFA',
    XPF: 'Fr',
    YER: 'ر.ي',
    ZAR: 'R',
    ZMW: 'ZK',
    ZWL: 'Z$'
};

type Currency = keyof typeof currencySymbols;

export { currencySymbols };
export type { Currency };

