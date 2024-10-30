import mongoose, { Document, Schema } from 'mongoose';

interface IExchangeRate extends Document {
    _id: string; // Use the currency code as the document ID
    rate: number;
    updatedAt: Date;
}

const ExchangeRateSchema: Schema = new Schema({
    _id: { type: String, required: true }, // Currency code as the document ID
    rate: { type: Number, required: true },
    updatedAt: { type: Date, required: true, default: Date.now }
});

const ExchangeRate = mongoose.model<IExchangeRate>('ExchangeRate', ExchangeRateSchema);

export default ExchangeRate;
