-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ENUMS
CREATE TYPE court_jurisdiction_type AS ENUM ('Anderson', 'Knox', 'Oak Ridge', 'Clinton');

-- TABLE: students_driver_ed
CREATE TABLE students_driver_ed (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    legal_name TEXT NOT NULL, -- Encrypted at application level
    permit_number TEXT NOT NULL, -- Encrypted at application level
    dob DATE NOT NULL,
    parent_email TEXT NOT NULL,
    contract_signed_url TEXT, -- DocuSign permalink
    classroom_hours INTEGER DEFAULT 0,
    driving_hours INTEGER DEFAULT 0,
    certificate_issued_at TIMESTAMP WITH TIME ZONE,
    class_session_id TEXT, -- Added to support "Inventory" counts per session
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT check_age CHECK (dob <= (CURRENT_DATE - INTERVAL '15 years'))
);

-- RLS: students_driver_ed
ALTER TABLE students_driver_ed ENABLE ROW LEVEL SECURITY;

-- Policy: Only Service Role (n8n/Backend) can ALL
CREATE POLICY "Service Role Full Access" ON students_driver_ed
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Policy: Public READ only via secure counts (handled by function, not direct table access recommended)
-- STRICT LIABILITY: No public policies for reading raw rows.

-- TABLE: traffic_school_compliance
CREATE TABLE traffic_school_compliance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    citation_number TEXT NOT NULL,
    court_jurisdiction court_jurisdiction_type NOT NULL,
    certificate_sent_to_clerk BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS: traffic_school_compliance
ALTER TABLE traffic_school_compliance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service Role Full Access Traffic" ON traffic_school_compliance
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- TABLE: audit_logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    action TEXT NOT NULL,
    details JSONB
);

-- RLS: audit_logs
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service Role Full Access Audit" ON audit_logs
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- SECURE FUNCTIONS
-- Function to get class counts without exposing student data
CREATE OR REPLACE FUNCTION get_class_enrollment_count(session_id TEXT)
RETURNS INTEGER
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT count(*)::integer 
    FROM students_driver_ed 
    WHERE class_session_id = session_id;
$$;
