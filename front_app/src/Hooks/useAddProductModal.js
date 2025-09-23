// src/hooks/useCreateProduct.js

import { useState } from 'react';
import { createProduct } from '../Api/AddProductModalApi';

export const useCreateProduct = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const create = async (productData) => { // Ya no recibe 'accessToken'
        setLoading(true);
        setError(null);
        setData(null);
        try {
            const newProduct = await createProduct(productData); // Ya no se le pasa
            setData(newProduct);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { create, loading, error, data };
};