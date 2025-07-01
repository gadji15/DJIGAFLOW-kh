-- Admin Logs Schema
-- This script creates the necessary tables and functions for comprehensive admin logging

-- Create admin_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    level VARCHAR(10) NOT NULL CHECK (level IN ('ERROR', 'WARN', 'INFO', 'DEBUG')),
    category VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    user_id UUID REFERENCES auth.users(id),
    user_email VARCHAR(255),
    message TEXT NOT NULL,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    url TEXT,
    stack_trace TEXT,
    duration NUMERIC(10,2), -- duration in ms or similar, nullable
    session_id UUID, -- tracking user session
    log_id TEXT UNIQUE, -- custom string identifier used by archive and init
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_admin_logs_timestamp ON admin_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_admin_logs_level ON admin_logs(level);
CREATE INDEX IF NOT EXISTS idx_admin_logs_category ON admin_logs(category);
CREATE INDEX IF NOT EXISTS idx_admin_logs_user_id ON admin_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_action ON admin_logs(action);
CREATE INDEX IF NOT EXISTS idx_admin_logs_session_id ON admin_logs(session_id);

-- Create composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_admin_logs_level_category ON admin_logs(level, category);
CREATE INDEX IF NOT EXISTS idx_admin_logs_timestamp_level ON admin_logs(timestamp DESC, level);

-- Create GIN index for JSONB details column
CREATE INDEX IF NOT EXISTS idx_admin_logs_details_gin ON admin_logs USING GIN(details);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_admin_logs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER trigger_update_admin_logs_updated_at
    BEFORE UPDATE ON admin_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_admin_logs_updated_at();

-- Create log retention function (keeps logs for 90 days by default)
CREATE OR REPLACE FUNCTION cleanup_old_admin_logs()
RETURNS void AS $$
BEGIN
    -- Supprimer les logs de plus de 90 jours (sauf les erreurs)
    DELETE FROM admin_logs 
    WHERE timestamp < NOW() - INTERVAL '90 days' 
    AND level != 'ERROR';
    
    -- Supprimer les logs d'erreur de plus de 1 an
    DELETE FROM admin_logs 
    WHERE timestamp < NOW() - INTERVAL '1 year' 
    AND level = 'ERROR';
END;
$$ LANGUAGE plpgsql;

-- Create log statistics view
CREATE OR REPLACE VIEW admin_logs_stats AS
SELECT 
    DATE_TRUNC('day', timestamp) as log_date,
    level,
    category,
    COUNT(*) as count,
    COUNT(DISTINCT user_id) as unique_users
FROM admin_logs
WHERE timestamp >= NOW() - INTERVAL '30 days'
GROUP BY DATE_TRUNC('day', timestamp), level, category
ORDER BY log_date DESC, count DESC;

-- Create view for recent errors
CREATE OR REPLACE VIEW recent_admin_errors AS
SELECT 
    id,
    timestamp,
    category,
    action,
    user_email,
    message,
    details,
    stack_trace
FROM admin_logs
WHERE level = 'ERROR'
AND timestamp >= NOW() - INTERVAL '24 hours'
ORDER BY timestamp DESC;

-- Create function to get log summary by category
CREATE OR REPLACE FUNCTION get_admin_logs_by_category(
    start_date TIMESTAMPTZ DEFAULT NOW() - INTERVAL '1 day',
    end_date TIMESTAMPTZ DEFAULT NOW()
)
RETURNS TABLE(
    category VARCHAR(100),
    total_count BIGINT,
    error_count BIGINT,
    warn_count BIGINT,
    info_count BIGINT,
    debug_count BIGINT,
    avg_duration NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        al.category,
        COUNT(*) as total_count,
        COUNT(*) FILTER (WHERE al.level = 'ERROR') as error_count,
        COUNT(*) FILTER (WHERE al.level = 'WARN') as warn_count,
        COUNT(*) FILTER (WHERE al.level = 'INFO') as info_count,
        COUNT(*) FILTER (WHERE al.level = 'DEBUG') as debug_count,
        ROUND(AVG(al.duration), 2) as avg_duration
    FROM admin_logs al
    WHERE al.timestamp BETWEEN start_date AND end_date
    GROUP BY al.category
    ORDER BY total_count DESC;
END;
$$ LANGUAGE plpgsql;

-- Create function to get error patterns
CREATE OR REPLACE FUNCTION get_error_patterns(
    start_date TIMESTAMPTZ DEFAULT NOW() - INTERVAL '1 day',
    end_date TIMESTAMPTZ DEFAULT NOW(),
    min_occurrences INTEGER DEFAULT 2
)
RETURNS TABLE(
    error_pattern TEXT,
    occurrence_count BIGINT,
    first_occurrence TIMESTAMPTZ,
    last_occurrence TIMESTAMPTZ,
    affected_users BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(al.details->>'errorMessage', al.details->>'message', 'Unknown error') as error_pattern,
        COUNT(*) as occurrence_count,
        MIN(al.timestamp) as first_occurrence,
        MAX(al.timestamp) as last_occurrence,
        COUNT(DISTINCT al.user_id) FILTER (WHERE al.user_id IS NOT NULL) as affected_users
    FROM admin_logs al
    WHERE al.level = 'ERROR'
        AND al.timestamp BETWEEN start_date AND end_date
    GROUP BY error_pattern
    HAVING COUNT(*) >= min_occurrences
    ORDER BY occurrence_count DESC;
END;
$$ LANGUAGE plpgsql;

-- Create function to get user activity summary
CREATE OR REPLACE FUNCTION get_user_activity_summary(
    start_date TIMESTAMPTZ DEFAULT NOW() - INTERVAL '1 day',
    end_date TIMESTAMPTZ DEFAULT NOW()
)
RETURNS TABLE(
    user_id UUID,
    user_email VARCHAR(255),
    user_role VARCHAR(50),
    total_actions BIGINT,
    error_count BIGINT,
    unique_sessions BIGINT,
    avg_duration NUMERIC,
    last_activity TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        al.user_id,
        al.user_email,
        (SELECT raw_app_meta_data->>'role' FROM auth.users WHERE id = al.user_id) as user_role,
        COUNT(*) as total_actions,
        COUNT(*) FILTER (WHERE al.level = 'ERROR') as error_count,
        COUNT(DISTINCT al.session_id) as unique_sessions,
        ROUND(AVG(al.duration), 2) as avg_duration,
        MAX(al.timestamp) as last_activity
    FROM admin_logs al
    WHERE al.user_id IS NOT NULL
        AND al.timestamp BETWEEN start_date AND end_date
    GROUP BY al.user_id, al.user_email
    ORDER BY total_actions DESC;
END;
$$ LANGUAGE plpgsql;

-- Create function to archive old logs to a separate table
CREATE TABLE IF NOT EXISTS admin_logs_archive (
    LIKE admin_logs INCLUDING ALL
);

CREATE OR REPLACE FUNCTION archive_admin_logs(archive_days INTEGER DEFAULT 30)
RETURNS INTEGER AS $$
DECLARE
    archived_count INTEGER;
BEGIN
    -- Move old logs to archive table
    INSERT INTO admin_logs_archive
    SELECT * FROM admin_logs 
    WHERE timestamp < NOW() - INTERVAL '1 day' * archive_days;
    
    GET DIAGNOSTICS archived_count = ROW_COUNT;
    
    -- Delete archived logs from main table
    DELETE FROM admin_logs 
    WHERE timestamp < NOW() - INTERVAL '1 day' * archive_days;
    
    -- Log the archival operation
    INSERT INTO admin_logs (
        log_id, level, category, action, details
    ) VALUES (
        'archive_' || extract(epoch from now())::text,
        'INFO',
        'MAINTENANCE',
        'LOG_ARCHIVAL',
        jsonb_build_object(
            'archived_count', archived_count,
            'archive_days', archive_days,
            'archive_timestamp', NOW()
        )
    );
    
    RETURN archived_count;
END;
$$ LANGUAGE plpgsql;

-- Create scheduled job for log cleanup (requires pg_cron extension)
-- This is optional and requires the pg_cron extension to be installed
-- SELECT cron.schedule('cleanup-admin-logs', '0 2 * * *', 'SELECT cleanup_old_admin_logs();');

-- Create function to get real-time log metrics
CREATE OR REPLACE FUNCTION get_realtime_log_metrics()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'current_timestamp', NOW(),
        'total_logs', (SELECT COUNT(*) FROM admin_logs),
        'last_5_minutes', (
            SELECT json_build_object(
                'total', COUNT(*),
                'errors', COUNT(*) FILTER (WHERE level = 'ERROR'),
                'warnings', COUNT(*) FILTER (WHERE level = 'WARN')
            )
            FROM admin_logs 
            WHERE timestamp >= NOW() - INTERVAL '5 minutes'
        ),
        'last_hour', (
            SELECT json_build_object(
                'total', COUNT(*),
                'errors', COUNT(*) FILTER (WHERE level = 'ERROR'),
                'warnings', COUNT(*) FILTER (WHERE level = 'WARN'),
                'unique_users', COUNT(DISTINCT user_id) FILTER (WHERE user_id IS NOT NULL)
            )
            FROM admin_logs 
            WHERE timestamp >= NOW() - INTERVAL '1 hour'
        ),
        'top_categories_today', (
            SELECT json_agg(
                json_build_object(
                    'category', category,
                    'count', count
                )
            )
            FROM (
                SELECT category, COUNT(*) as count
                FROM admin_logs 
                WHERE timestamp >= CURRENT_DATE
                GROUP BY category
                ORDER BY count DESC
                LIMIT 5
            ) t
        ),
        'recent_errors', (
            SELECT json_agg(
                json_build_object(
                    'timestamp', timestamp,
                    'category', category,
                    'action', action,
                    'user_email', user_email,
                    'message', message
                )
            )
            FROM (
                SELECT timestamp, category, action, user_email, message
                FROM admin_logs 
                WHERE level = 'ERROR'
                    AND timestamp >= NOW() - INTERVAL '1 hour'
                ORDER BY timestamp DESC
                LIMIT 10
            ) t
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create materialized view for performance dashboard
CREATE MATERIALIZED VIEW IF NOT EXISTS admin_logs_hourly_stats AS
SELECT 
    date_trunc('hour', timestamp) as hour,
    level,
    category,
    COUNT(*) as log_count,
    COUNT(DISTINCT user_id) FILTER (WHERE user_id IS NOT NULL) as unique_users,
    AVG(duration) FILTER (WHERE duration IS NOT NULL) as avg_duration
FROM admin_logs
WHERE timestamp >= NOW() - INTERVAL '7 days'
GROUP BY date_trunc('hour', timestamp), level, category
ORDER BY hour DESC;

-- Create unique index on materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_admin_logs_hourly_stats_unique 
ON admin_logs_hourly_stats(hour, level, category);

-- Create function to refresh hourly stats
CREATE OR REPLACE FUNCTION refresh_admin_logs_hourly_stats()
RETURNS VOID AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY admin_logs_hourly_stats;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically refresh stats when new logs are added
CREATE OR REPLACE FUNCTION trigger_refresh_hourly_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Only refresh if the log is from the current hour
    IF date_trunc('hour', NEW.timestamp) = date_trunc('hour', NOW()) THEN
        PERFORM pg_notify('refresh_stats', 'hourly');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_admin_logs_stats_refresh ON admin_logs;
CREATE TRIGGER trigger_admin_logs_stats_refresh
    AFTER INSERT ON admin_logs
    FOR EACH ROW
    EXECUTE FUNCTION trigger_refresh_hourly_stats();

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON admin_logs TO authenticated;
GRANT SELECT ON admin_logs_stats TO authenticated;
GRANT SELECT ON admin_logs_hourly_stats TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_old_admin_logs() TO authenticated;
GRANT EXECUTE ON FUNCTION get_admin_logs_by_category(TIMESTAMPTZ, TIMESTAMPTZ) TO authenticated;
GRANT EXECUTE ON FUNCTION get_error_patterns(TIMESTAMPTZ, TIMESTAMPTZ, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_activity_summary(TIMESTAMPTZ, TIMESTAMPTZ) TO authenticated;
GRANT EXECUTE ON FUNCTION get_realtime_log_metrics() TO authenticated;

-- Create RLS policies for admin_logs table
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can view all logs
CREATE POLICY admin_logs_policy ON admin_logs
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_app_meta_data->>'role' = 'admin'
        )
    );

-- Create function to insert log from application
CREATE OR REPLACE FUNCTION insert_admin_log(
    p_level VARCHAR(10),
    p_category VARCHAR(50),
    p_action VARCHAR(100),
    p_message TEXT,
    p_details JSONB DEFAULT NULL,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_url TEXT DEFAULT NULL,
    p_stack_trace TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    log_id UUID;
BEGIN
    INSERT INTO admin_logs (
        level,
        category,
        action,
        user_id,
        user_email,
        message,
        details,
        ip_address,
        user_agent,
        url,
        stack_trace
    ) VALUES (
        p_level,
        p_category,
        p_action,
        auth.uid(),
        (SELECT email FROM auth.users WHERE id = auth.uid()),
        p_message,
        p_details,
        p_ip_address,
        p_user_agent,
        p_url,
        p_stack_trace
    ) RETURNING id INTO log_id;
    
    RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert initial log entry
INSERT INTO admin_logs (
    log_id, level, category, action, details
) VALUES (
    'schema_init_' || extract(epoch from now())::text,
    'INFO',
    'DATABASE',
    'SCHEMA_INITIALIZATION',
    jsonb_build_object(
        'message', 'Admin logs schema initialized successfully',
        'timestamp', NOW(),
        'version', '1.0.0'
    )
) ON CONFLICT (log_id) DO NOTHING;

-- Create comment on table
COMMENT ON TABLE admin_logs IS 'Table de stockage des logs d''administration pour le suivi et le débogage';
COMMENT ON COLUMN admin_logs.level IS 'Niveau de log: ERROR, WARN, INFO, DEBUG';
COMMENT ON COLUMN admin_logs.category IS 'Catégorie du log: FORM, UI, NAVIGATION, CONNECTION, etc.';
COMMENT ON COLUMN admin_logs.action IS 'Action spécifique qui a généré le log';
COMMENT ON COLUMN admin_logs.details IS 'Détails supplémentaires au format JSON';
COMMENT ON COLUMN admin_logs.message IS 'Message du log';
COMMENT ON FUNCTION cleanup_old_admin_logs() IS 'Fonction de nettoyage automatique des anciens logs';
COMMENT ON FUNCTION insert_admin_log() IS 'Fonction sécurisée pour insérer des logs depuis l''application';
