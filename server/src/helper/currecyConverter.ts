import ExchangeRate from "../models/exchangeRates";

type ExchangeRateCache = {
    [currencyCode: string]: number;
};

let exchangeRateCache: ExchangeRateCache = {};
let lastCacheUpdate = 0;
const CACHE_DURATION = 10 * 60 * 60 * 1000;

const refreshCache = async () => {
    const exchangeRates = await ExchangeRate.find({});
    exchangeRateCache = {};
    exchangeRates.forEach((rate) => {
        exchangeRateCache[rate._id] = rate.rate;
    });
    lastCacheUpdate = Date.now();
};

const getExchangeRate = async (currency: string) => {
    if (Date.now() - lastCacheUpdate > CACHE_DURATION) {
        await refreshCache();
    }
    return exchangeRateCache[currency];
};

const convertCurrency = async (amount: number, from: string, to: string): Promise<number | null> => {
    try {
        const rateFrom = await getExchangeRate(from);
        const rateTo = await getExchangeRate(to);

        if (!rateFrom || !rateTo) {
            console.error(`Missing exchange rate for: ${!rateFrom ? from : to}`);
            return null;
        }

        const convertedAmount = (amount / rateFrom) * rateTo;
        return Math.round(convertedAmount * 100) / 100;

    } catch (error) {
        console.error("Error during currency conversion:", error);
        return null;
    }
};

export default convertCurrency;
