import { Product } from "../models/product.model.js";

export const buildOrderItems = async (items = []) => {
    if (!Array.isArray(items) || items.length === 0) {
        return { error: "Cart is empty" };
    }

    const normalizedItems = items
        .map((item) => ({
            productId: item.productId || item.product,
            quantity: Number(item.quantity || 0),
        }))
        .filter((item) => item.productId);

    if (normalizedItems.length === 0) {
        return { error: "No valid products in cart" };
    }

    const productIds = [...new Set(normalizedItems.map((item) => item.productId.toString()))];
    const products = await Product.find({ _id: { $in: productIds } });
    const productMap = new Map(products.map((product) => [product._id.toString(), product]));

    if (productMap.size !== productIds.length) {
        return { error: "Some products are unavailable" };
    }

    const orderItems = [];
    let totalAmount = 0;

    for (const item of normalizedItems) {
        const product = productMap.get(item.productId.toString());
        if (!product) {
            return { error: "Some products are unavailable" };
        }

        const quantity = Math.max(1, item.quantity);
        const price = product.price;

        totalAmount += price * quantity;
        orderItems.push({
            product: product._id,
            quantity,
            price,
        });
    }

    return { orderItems, totalAmount, productMap };
};
