-- Create credentials table
CREATE TABLE IF NOT EXISTS public.credentials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    category TEXT NOT NULL,
    favorite BOOLEAN DEFAULT false,
    strength TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Set up RLS (Row Level Security)
ALTER TABLE public.credentials ENABLE ROW LEVEL SECURITY;

-- Create policy to ensure users can only access their own credentials
CREATE POLICY "Users can only access their own credentials"
    ON public.credentials
    FOR ALL
    USING (auth.uid() = user_id);

-- Create policy to ensure users can only insert their own credentials
CREATE POLICY "Users can only insert their own credentials"
    ON public.credentials
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create policy to ensure users can only update their own credentials
CREATE POLICY "Users can only update their own credentials"
    ON public.credentials
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Create policy to ensure users can only delete their own credentials
CREATE POLICY "Users can only delete their own credentials"
    ON public.credentials
    FOR DELETE
    USING (auth.uid() = user_id);
