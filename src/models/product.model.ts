import mongoose from 'mongoose';
import { IProduct } from '../interfaces/product.interface';

const productSchema = new mongoose.Schema<IProduct>({
    description: { type : String, required: false },
    name: { type : String, required: true },
    price: { type: Number, required: true },
    quantity: { type : Number, required: true }
});

const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product;