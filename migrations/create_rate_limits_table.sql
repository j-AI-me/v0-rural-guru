-- Crear tabla para almacenar límites de tasa
CREATE TABLE IF NOT EXISTS rate_limits (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Crear índice para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_rate_limits_key ON rate_limits(key);

-- Crear función para limpiar registros antiguos
CREATE OR REPLACE FUNCTION clean_old_rate_limits() RETURNS void AS $$
BEGIN
  DELETE FROM rate_limits
  WHERE created_at < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql;

-- Crear trabajo programado para limpiar registros antiguos cada hora
SELECT cron.schedule(
  'clean-rate-limits',
  '0 * * * *',
  $$SELECT clean_old_rate_limits()$$
);
