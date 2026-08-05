const { createClient } = require('@supabase/supabase-js');

const URL = "https://dejnentgbbnywhmpvzqo.supabase.co";
const ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlam5lbnRnYmJueXdobXB2enFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5Mzc2NjcsImV4cCI6MjEwMTUxMzY2N30.GyIkbV4MyCHUH1khNWm_A6upuJOl4WgG876Qp9fdMNI";

const supabase = createClient(URL, ANON);

async function check() {
  const { data, error } = await supabase.from('dramas').select('*').limit(1);
  console.log('Columns:', data && data[0] ? Object.keys(data[0]) : []);
}
check();
