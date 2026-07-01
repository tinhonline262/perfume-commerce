-- Add new columns to perfume
ALTER TABLE perfume ADD COLUMN IF NOT EXISTS sold_quantity INT DEFAULT 0;
ALTER TABLE perfume ADD COLUMN IF NOT EXISTS low_stock_threshold INT DEFAULT 10;

-- Update existing records
UPDATE perfume SET sold_quantity = 0 WHERE sold_quantity IS NULL;
UPDATE perfume SET low_stock_threshold = 10 WHERE low_stock_threshold IS NULL;

-- Inventory logs table
CREATE SEQUENCE IF NOT EXISTS inventory_logs_seq START 1 INCREMENT 1;

CREATE TABLE IF NOT EXISTS inventory_logs (
    id BIGINT NOT NULL DEFAULT nextval('inventory_logs_seq'),
    perfume_id BIGINT NOT NULL,
    admin_id BIGINT,
    quantity_changed INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_inventory_log_perfume FOREIGN KEY (perfume_id) REFERENCES perfume(id) ON DELETE CASCADE,
    CONSTRAINT fk_inventory_log_admin FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Email history table
CREATE SEQUENCE IF NOT EXISTS email_history_seq START 1 INCREMENT 1;

CREATE TABLE IF NOT EXISTS email_history (
    id BIGINT NOT NULL DEFAULT nextval('email_history_seq'),
    subject VARCHAR(255) NOT NULL,
    body TEXT,
    target_audience VARCHAR(100),
    sent_date TIMESTAMP NOT NULL,
    PRIMARY KEY (id)
);
