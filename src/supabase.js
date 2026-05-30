import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://rlwbnjhanhndyaevqhrf.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsd2JuamhhbmhuZHlhZXZxaHJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwMTIxMTgsImV4cCI6MjA5NTU4ODExOH0.dhqtpF-LDjg1v39FOKtSdUQptVkGudbrlQ_wOtmOXY4";

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);