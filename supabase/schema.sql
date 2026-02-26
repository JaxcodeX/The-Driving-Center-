-- =============================================================
-- The Driving Center BOS — Supabase Schema
-- Synced from live DB on 2026-02-25
-- =============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ENUMS
CREATE TYPE court_jurisdiction_type AS ENUM ('Anderson', 'Knox', 'Oak Ridge', 'Clinton');

-- =============================================================
-- TABLE: students_driver_ed
-- =============================================================
CREATE TABLE students_driver_ed (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    legal_name TEXT NOT NULL,               -- Encrypted at application level
    permit_number TEXT,                     -- Encrypted at application level
    dob DATE NOT NULL,
    parent_email TEXT NOT NULL,
    contract_signed_url TEXT,               -- DocuSign permalink
    classroom_hours INTEGER DEFAULT 0,
    driving_hours INTEGER DEFAULT 0,
    certificate_issued_at TIMESTAMP WITH TIME ZONE,
    class_session_id TEXT,                  -- Links to session inventory
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    permit_expiration DATE,
    date_of_birth DATE,                     -- Duplicate of dob (legacy)
    address_street TEXT,
    address_city TEXT,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    signature_url TEXT,

    CONSTRAINT check_age CHECK (dob <= (CURRENT_DATE - INTERVAL '15 years'))
);

-- RLS: students_driver_ed
ALTER TABLE students_driver_ed ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service Role Full Access" ON students_driver_ed
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- =============================================================
-- TABLE: traffic_school_compliance
-- =============================================================
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

-- =============================================================
-- TABLE: audit_logs
-- =============================================================
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

-- =============================================================
-- TABLE: sessions
-- =============================================================
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    max_seats INTEGER DEFAULT 30,
    seats_booked INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS: sessions (Public READ access for seat availability)
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON sessions
    FOR SELECT
    TO public
    USING (true);

-- =============================================================
-- TABLE: payments
-- =============================================================
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students_driver_ed(id),
    stripe_session_id TEXT NOT NULL UNIQUE,
    amount INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status = ANY (ARRAY['pending', 'paid', 'refunded', 'failed'])),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS: payments
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service Role Full Access" ON payments
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "No Public Read" ON payments
    FOR SELECT
    TO anon, authenticated
    USING (false);

CREATE POLICY "No Public Insert" ON payments
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (false);

-- =============================================================
-- SECURE FUNCTIONS
-- =============================================================

-- Get class enrollment count without exposing student data
CREATE OR REPLACE FUNCTION get_class_enrollment_count(session_id TEXT)
RETURNS INTEGER
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT count(*)::integer
    FROM public.students_driver_ed
    WHERE class_session_id = session_id;
$$;
