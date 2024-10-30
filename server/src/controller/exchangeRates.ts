import axios from "axios";
import ExchangeRate from "../models/exchangeRates";

export const updateExchangeRates = async () => {
    try {
        const response = await axios.get('https://v6.exchangerate-api.com/v6/f6cfdff34545486ea14402ed/latest/USD');
        console.log(response.data); // Log the response to inspect the structure
        const rates = response.data?.conversion_rates;

        if (!rates) {
            console.error("Conversion rates data is undefined or null.");
            return;
        }

        const lastUpdated = new Date(response.data.time_last_update_utc);

        const updatePromises = Object.entries(rates).map(([currency, rate]) => {
            return ExchangeRate.updateOne(
                { _id: currency },
                { rate: rate, updatedAt: lastUpdated },
                { upsert: true }
            );
        });

        await Promise.all(updatePromises);
        console.log('Exchange rates updated successfully.');
    } catch (error) {
        console.error('Error updating exchange rates:', error);
    }
};
