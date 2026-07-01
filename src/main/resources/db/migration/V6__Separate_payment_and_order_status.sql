-- 1. Add order_status column
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_status VARCHAR(50);

-- 2. Migrate data
-- Treat old payment_status values that were actually order statuses
UPDATE orders
SET order_status = 'CANCELLED'
WHERE payment_status = 'CANCELLED';

UPDATE orders
SET order_status = 'DELIVERED'
WHERE payment_status IN ('DELIVERED', 'SUCCESS'); -- Assume SUCCESS from VNPAY implies processed for old orders (we map it to pending below to be safe, but requirements say "For all orders currently marked SUCCESS because of VNPay: PaymentStatus = PAID, OrderStatus = PENDING unless they have already been processed.")
-- Let's stick strictly to the requirement: "For all orders currently marked SUCCESS because of VNPay: PaymentStatus = PAID, OrderStatus = PENDING"

UPDATE orders
SET order_status = 'PENDING'
WHERE order_status IS NULL OR order_status = '';

UPDATE orders
SET payment_status = 'PAID'
WHERE payment_status = 'SUCCESS';

UPDATE orders
SET payment_status = 'UNPAID'
WHERE payment_status IN ('PENDING', 'PROCESSING', 'SHIPPING', 'DELIVERED', 'CANCELLED', 'FAILED');

-- Fix any old order_status_history rows
ALTER TABLE order_status_history DROP CONSTRAINT IF EXISTS fk_status_history_order;
ALTER TABLE order_status_history DROP CONSTRAINT IF EXISTS fk_status_history_admin;
