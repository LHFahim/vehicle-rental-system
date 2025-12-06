import { Pool } from "pg";
import config from ".";

export const pool = new Pool({
  connectionString: config.DB_URL,
});

const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users(
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password TEXT NOT NULL CHECK (char_length(password) >= 6),
      role VARCHAR(50) NOT NULL DEFAULT 'customer'
        CHECK (role IN ('admin', 'customer')),
      phone VARCHAR(20) NOT NULL
    );
  `);

  await pool.query(`
    CREATE OR REPLACE FUNCTION force_email_lowercase()
    RETURNS trigger AS $$
    BEGIN
      NEW.email := lower(NEW.email);
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  await pool.query(`
    DROP TRIGGER IF EXISTS trg_email_lowercase ON users;
  `);

  await pool.query(`
    CREATE TRIGGER trg_email_lowercase
    BEFORE INSERT OR UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION force_email_lowercase();
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS vehicles(
      id SERIAL PRIMARY KEY,
      vehicle_name VARCHAR(100) NOT NULL,
      type VARCHAR(20) NOT NULL
        CHECK (type IN ('car', 'bike', 'van', 'SUV')),
      registration_number VARCHAR(50) UNIQUE NOT NULL,
      daily_rent_price NUMERIC(10,2) NOT NULL
        CHECK (daily_rent_price > 0),
      availability_status VARCHAR(20) NOT NULL
        CHECK (availability_status IN ('available', 'booked'))
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    vehicle_id INT NOT NULL
        REFERENCES vehicles(id)
        ON DELETE CASCADE,

    rent_start_date DATE NOT NULL,
    
    rent_end_date DATE NOT NULL
        CHECK (rent_end_date > rent_start_date),

    total_price NUMERIC(10,2) NOT NULL
        CHECK (total_price > 0),

    status VARCHAR(20) NOT NULL
        CHECK (status IN ('active', 'cancelled', 'returned')) 
)
`);

  console.log("Database initialized");
};

export default initDB;
