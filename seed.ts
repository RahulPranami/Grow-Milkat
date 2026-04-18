
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Requires service role for auth.admin

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function seedAdmin() {
  const adminEmail = 'admin@growmilkat.com';
  const adminPassword = 'AdminPassword123!';
  const adminName = 'System Administrator';

  console.log(`Checking if admin exists: ${adminEmail}...`);

  // 1. Check if user already exists in auth.users
  const { data: users, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error("Error listing users:", listError);
    return;
  }

  let adminUser = users.users.find(u => u.email === adminEmail);

  if (!adminUser) {
    console.log("Creating new admin user in auth.users...");
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: { full_name: adminName }
    });

    if (createError) {
      console.error("Error creating admin user:", createError);
      return;
    }
    adminUser = newUser.user;
  } else {
    console.log("Admin user already exists in auth.users.");
  }

  if (adminUser) {
    // 2. Ensure profile exists in public.users table with role 'admin'
    console.log("Upserting admin profile to public.users...");
    const { error: profileError } = await supabase
      .from('users')
      .upsert({
        id: adminUser.id,
        name: adminName,
        email: adminEmail,
        role: 'admin',
        kycStatus: 'Verified',
        joinedDate: new Date().toISOString().split('T')[0]
      });

    if (profileError) {
      console.error("Error upserting admin profile:", profileError);
    } else {
      console.log("Admin account successfully seeded!");
      console.log(`Email: ${adminEmail}`);
      console.log(`Password: ${adminPassword}`);
    }
  }
}

seedAdmin();
