import test, { mock } from "node:test";
import assert from "node:assert/strict";
import { Product } from "../models/product.model.js";
import { buildOrderItems } from "../utils/orderPricing.js";

test("buildOrderItems returns error for empty or invalid cart", async () => {
  assert.deepEqual(await buildOrderItems([]), { error: "Cart is empty" });
  assert.deepEqual(await buildOrderItems([{ quantity: 2 }]), {
    error: "No valid products in cart",
  });
});

test("buildOrderItems returns error when requested product is missing", async () => {
  const findMock = mock.method(Product, "find", async () => []);
  try {
    const result = await buildOrderItems([{ productId: "p1", quantity: 1 }]);
    assert.deepEqual(result, { error: "Some products are unavailable" });
  } finally {
    findMock.mock.restore();
  }
});

test("buildOrderItems computes authoritative total from DB prices and clamps quantity", async () => {
  const findMock = mock.method(Product, "find", async () => [
    { _id: "p1", price: 120 },
    { _id: "p2", price: 50 },
  ]);

  try {
    const result = await buildOrderItems([
      { productId: "p1", quantity: 2, price: 1 },
      { productId: "p2", quantity: 0 },
    ]);

    assert.equal(result.error, undefined);
    assert.equal(result.totalAmount, 290);
    assert.deepEqual(result.orderItems, [
      { product: "p1", quantity: 2, price: 120 },
      { product: "p2", quantity: 1, price: 50 },
    ]);
  } finally {
    findMock.mock.restore();
  }
});

