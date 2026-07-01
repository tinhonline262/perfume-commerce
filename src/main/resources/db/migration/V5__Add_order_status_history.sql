-- Add updated_at column to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP;

-- Initialize updated_at for existing rows
UPDATE orders SET updated_at = NOW() WHERE updated_at IS NULL;

-- Create sequence for order_status_history
CREATE SEQUENCE IF NOT EXISTS order_status_history_seq START 1 INCREMENT 1;

-- Create order_status_history table
CREATE TABLE IF NOT EXISTS order_status_history (
    id          BIGINT NOT NULL DEFAULT nextval('order_status_history_seq'),
    order_id    BIGINT NOT NULL,
    old_status  VARCHAR(50),
    new_status  VARCHAR(50) NOT NULL,
    admin_id    BIGINT,
    changed_at  TIMESTAMP NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE IF EXISTS order_status_history
    ADD CONSTRAINT fk_status_history_order
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;

ALTER TABLE IF EXISTS order_status_history
    ADD CONSTRAINT fk_status_history_admin
    FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE SET NULL;
