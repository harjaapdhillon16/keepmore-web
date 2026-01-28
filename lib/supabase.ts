import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://iimlwwmxbaeinfcpqsxp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpbWx3d214YmFlaW5mY3Bxc3hwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODg1MzIyMSwiZXhwIjoyMDg0NDI5MjIxfQ.XpPo_lsDlcVJ3hr1Nfhcu62VTH9W9xPSE_nO_hFTV7M'
  
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
