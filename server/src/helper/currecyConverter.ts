import ExchangeRate from "../models/exchangeRates";

// Types
interface ExchangeRateDocument {
    _id: string;
    rate: number;
    lastUpdated?: Date;
}

interface ExchangeRateCache {
    [currencyCode: string]: {
        rate: number;
        timestamp: number;
    };
}

class CurrencyConversionError extends Error {
    constructor(message: string, public code: string) {
        super(message);
        this.name = 'CurrencyConversionError';
    }
}

class CurrencyConverter {
    private static instance: CurrencyConverter;
    private cache: ExchangeRateCache = {};
    private readonly CACHE_DURATION = 10 * 60 * 60 * 1000; // 10 hours
    private refreshPromise: Promise<void> | null = null;

    private constructor() { }

    public static getInstance(): CurrencyConverter {
        if (!CurrencyConverter.instance) {
            CurrencyConverter.instance = new CurrencyConverter();
        }
        return CurrencyConverter.instance;
    }

    private async refreshCache(currencies: string[]): Promise<void> {
        try {
            // Use specific currency codes in query if provided
            const query = currencies.length > 0
                ? { _id: { $in: currencies } }
                : {};

            const exchangeRates = await ExchangeRate.find(query) as ExchangeRateDocument[];

            const currentTime = Date.now();
            exchangeRates.forEach((rate) => {
                this.cache[rate._id] = {
                    rate: rate.rate,
                    timestamp: currentTime
                };
            });
        } catch (error) {
            throw new CurrencyConversionError(
                `Failed to refresh exchange rates: ${(error as Error).message}`,
                'REFRESH_FAILED'
            );
        } finally {
            this.refreshPromise = null;
        }
    }

    private async getExchangeRate(currency: string): Promise<number> {
        const currentTime = Date.now();
        const cachedRate = this.cache[currency];

        if (!cachedRate || currentTime - cachedRate.timestamp > this.CACHE_DURATION) {
            // If there's already a refresh in progress, wait for it
            if (this.refreshPromise) {
                await this.refreshPromise;
            } else {
                this.refreshPromise = this.refreshCache([currency]);
                await this.refreshPromise;
            }
        }

        const rate = this.cache[currency]?.rate;
        if (!rate) {
            throw new CurrencyConversionError(
                `Exchange rate not found for currency: ${currency}`,
                'RATE_NOT_FOUND'
            );
        }

        return rate;
    }

    public async convert(
        amount: number,
        from: string,
        to: string
    ): Promise<number> {
        try {
            // Input validation
            if (amount < 0) {
                throw new CurrencyConversionError(
                    'Amount cannot be negative',
                    'INVALID_AMOUNT'
                );
            }

            if (!from || !to) {
                throw new CurrencyConversionError(
                    'Currency codes must be specified',
                    'INVALID_CURRENCY_CODE'
                );
            }

            // Optimize by fetching both rates at once
            if (this.refreshPromise) {
                await this.refreshPromise;
            } else if (
                !this.cache[from] ||
                !this.cache[to] ||
                Date.now() - Math.max(
                    this.cache[from]?.timestamp || 0,
                    this.cache[to]?.timestamp || 0
                ) > this.CACHE_DURATION
            ) {
                this.refreshPromise = this.refreshCache([from, to]);
                await this.refreshPromise;
            }

            const [rateFrom, rateTo] = await Promise.all([
                this.getExchangeRate(from),
                this.getExchangeRate(to)
            ]);

            const convertedAmount = (amount / rateFrom) * rateTo;

            // Round to 2 decimal places
            return Math.round(convertedAmount * 100) / 100;
        } catch (error) {
            if (error instanceof CurrencyConversionError) {
                throw error;
            }
            throw new CurrencyConversionError(
                `Currency conversion failed: ${(error as Error).message}`,
                'CONVERSION_FAILED'
            );
        }
    }
}

// Export a singleton instance wrapper for backward compatibility
const convertCurrency = async (
    amount: number,
    from: string,
    to: string
): Promise<number | null> => {
    try {
        const converter = CurrencyConverter.getInstance();
        return await converter.convert(amount, from, to);
    } catch (error) {
        console.error('Currency conversion error:', error);
        return null;
    }
};

export default convertCurrency;
// Export the class for more advanced usage
export { CurrencyConverter, CurrencyConversionError };