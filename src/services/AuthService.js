// src/services/AuthService.js
import { supabase } from "../supabaseClient";


export async function registerUser(
  email,
  password,
  fullName,
  roleName,
  phone,
  address,
  servicetype,
  experience,
  location = null
) {
  const safeServiceType =
    servicetype && servicetype.trim() !== "" ? servicetype : "Delivery";
  const safeExperience =
    experience && experience.toString().trim() !== "" ? experience : "5";
  const safeLocation =
    location && location.trim() !== "" ? location : "Karur";

  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;

  const user = data.user;

  return {
    message:
      "Account created! Please check your email to confirm your account before logging in.",
    userId: user.id,
    role: roleName.toLowerCase(),
    fullName,
    phone,
    address,
    servicetype: safeServiceType,
    experience: safeExperience,
    location: safeLocation,
  };
}


export async function insertUserProfile(
  userId,
  fullName,
  email,
  roleName,
  phone,
  address,
  servicetype = null,
  experience = null,
  location = null
) {
  const role = roleName.toLowerCase();
  const safeServiceType =
    servicetype && servicetype.trim() !== "" ? servicetype : "Delivery";
  const safeExperience =
    experience && experience.toString().trim() !== "" ? experience : "5";
  const safeLocation =
    location && location.trim() !== "" ? location : "Karur";

  const { data, error } = await supabase
    .from("profiles")
    .insert([
      {
        id: userId,
        name: fullName,
        email,
        role,
        phone,
        address,
        servicetype: safeServiceType,
        experience: safeExperience,
        location: safeLocation,
      },
    ])
    .maybeSingle();

  if (error) throw error;
  return data;
}


export async function loginUser(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;

  const user = data.user;

  if (!user.confirmed_at) {
    throw new Error(
      "Email not confirmed. Please check your inbox and confirm your email."
    );
  }

  let { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select(
      "name, role, email, phone, address, servicetype, experience, location"
    )
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) throw profileError;

  if (!profile) {
    const { data: newProfile, error: insertError } = await supabase
      .from("profiles")
      .insert([
        {
          id: user.id,
          name: user.user_metadata?.full_name || "",
          email: user.email,
          role: "user",
          servicetype: "Delivery",
          experience: "5",
          location: "Karur",
        },
      ])
      .select()
      .maybeSingle();

    if (insertError) throw insertError;
    profile = newProfile;
  }

  return { user, profile };
}


export async function fetchServiceWorkers() {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, name, email")
    .ilike("role", "service");
  if (error) throw error;

  return data.map((worker) => ({
    id: worker.id,
    name:
      worker.name && worker.name.trim() !== "" ? worker.name : worker.email,
    email: worker.email,
  }));
}


export async function addSalaryRecord(serviceId, month, amount, status = "Pending") {
  const { data, error } = await supabase
    .from("salaries")
    .insert([{ service_id: serviceId, month, amount, status }])
    .select()
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchAllSalaries() {
  const { data, error } = await supabase
    .from("salaries")
    .select("id, month, amount, status, created_at, service_id, profiles(name)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function fetchSalariesByService(serviceId) {
  const { data, error } = await supabase
    .from("salaries")
    .select("id, month, amount, status, created_at")
    .eq("service_id", serviceId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function updateSalaryStatus(id, status) {
  const { data, error } = await supabase
    .from("salaries")
    .update({ status })
    .eq("id", id)
    .select()
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function deleteSalaryRecord(id) {
  const { error } = await supabase.from("salaries").delete().eq("id", id);
  if (error) throw error;
  return true;
}


export async function markAttendance(serviceId, date, status) {
  const { data, error } = await supabase
    .from("attendance")
    .upsert(
      [{ service_id: serviceId, date, status }],
      { onConflict: ["service_id", "date"] } // must match UNIQUE constraint in DB
    )
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}


export async function removeAttendance(serviceId, date) {
  const { error } = await supabase
    .from("attendance")
    .delete()
    .eq("service_id", serviceId)
    .eq("date", date);

  if (error) throw error;
  return true;
}


export async function fetchServiceAttendance(serviceId) {
  const { data, error } = await supabase
    .from("attendance")
    .select("id, date, status")
    .eq("service_id", serviceId)
    .order("date", { ascending: false });

  if (error) throw error;
  return data;
}


export async function fetchAllAttendance() {
  const { data, error } = await supabase
    .from("attendance")
    .select("id, service_id, date, status, profiles(name,email)")
    .eq("profiles.role", "service")
    .order("date", { ascending: false });

  if (error) throw error;
  return data;
}




export async function submitSupportTicket(userId, name, email, message) {
  const { data, error } = await supabase
    .from("support_tickets")
    .insert([{ user_id: userId, user_name: name, user_email: email, message }])
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}


export async function fetchAllSupportTickets() {
  const { data, error } = await supabase
    .from("support_tickets")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}


export async function fetchUserTickets(userId) {
  const { data, error } = await supabase
    .from("support_tickets")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}


export async function replyToTicket(ticketId, replyMessage) {
  const { data, error } = await supabase
    .from("support_tickets")
    .update({ reply: replyMessage, status: "Resolved" })
    .eq("id", ticketId)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}



export async function submitServiceTicket(serviceId, message) {
  const { data, error } = await supabase
    .from("service_support")
    .insert([{ service_id: serviceId, message, status: "Open" }])
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}



export async function fetchServiceTickets(serviceId) {
  const { data, error } = await supabase
    .from("service_support")
    .select("*")
    .eq("service_id", serviceId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}



export async function fetchAllServiceTickets() {
  const { data, error } = await supabase
    .from("service_support")
    .select("*, profiles(name, email)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}



export async function replyServiceTicket(ticketId, reply) {
  const { data, error } = await supabase
    .from("service_support")
    .update({ reply, status: "Resolved", updated_at: new Date() })
    .eq("id", ticketId)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}




export async function submitContactMessage(name, email, phone, message) {
  const { data, error } = await supabase
    .from("contact_messages")
    .insert([{ name, email, phone, message }])
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}



export async function fetchContactMessages() {
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}



export async function submitReview(userId, serviceId, rating, review_text) {
  const { data, error } = await supabase
    .from("review")
    .insert([
      {
        user_id: userId,
        service_id: serviceId,
        rating,
        review_text,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}


export async function fetchServiceReviews(serviceId) {
  const { data, error } = await supabase
    .from("review")
    .select(`
      id,
      rating,
      review_text,
      created_at,
      user:profiles!review_user_id_fkey (
        id,
        name,
        email
      )
    `)
    .eq("service_id", serviceId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}


export async function fetchUserReviews(userId) {
  const { data, error } = await supabase
    .from("review")
    .select(`
      id,
      rating,
      review_text,
      created_at,
      service:profiles!review_service_id_fkey (
        id,
        name,
        email
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}


export async function fetchAllReviews() {
  const { data, error } = await supabase
    .from("review")
    .select(`
      id,
      rating,
      review_text,
      created_at,
      user:profiles!user_id ( name, email ),
      service:profiles!service_id ( name, email )
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}



export async function fetchServiceAverageRating(serviceId) {
  const { data, error } = await supabase
    .from("review")
    .select("rating")
    .eq("service_id", serviceId);

  if (error) throw error;
  if (!data || data.length === 0) return 0;

  const total = data.reduce((sum, r) => sum + Number(r.rating), 0);
  return (total / data.length).toFixed(1);
}


export async function deleteReviewById(reviewId) {
  const { error } = await supabase
    .from("review")
    .delete()
    .eq("id", reviewId);

  if (error) throw error;
  return true;
}
