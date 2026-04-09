import { supabase } from "../supabaseClient";

const DEFAULT_ADMIN_ID = "6404fbb4-b28a-4b16-93e0-7513bbafb6cd";


async function uploadTaskImage(file) {
  if (!file) return null;
  const fileName = `${Date.now()}_${file.name}`;
  const { data, error } = await supabase.storage
    .from("task-images")
    .upload(fileName, file);
  if (error) throw error;

  const { publicUrl } = supabase.storage
    .from("task-images")
    .getPublicUrl(fileName);
  return publicUrl;
}


export async function createTask({
  user_id,
  title,
  description = "",
  location = "",
  deadline = null,
  price = 0,
  payment_method = "Cash on Delivery",
  online_payment_option = "",
  urgency = "Normal",
  imageFile = null,
}) {
  try {
    const image_url = imageFile ? await uploadTaskImage(imageFile) : null;

    const newTask = {
      user_id,
      title,
      description,
      location,
      deadline,
      price,
      payment_method,
      online_payment_option,
      payment_status: payment_method === "Online Payment" ? "Paid" : "Unpaid",
      urgency,
      status: "Pending",
      admin_id: DEFAULT_ADMIN_ID, 
      image_url,
    };

    const { data, error } = await supabase
      .from("tasks")
      .insert([newTask])
      .select()
      .single();
    if (error) throw error;

    await addTaskLog({
      task_id: data.id,
      updated_by: user_id,
      role: "user",
      old_status: null,
      new_status: "Pending",
      remarks: "Task created by user",
    });

    return data;
  } catch (err) {
    console.error("createTask error:", err.message);
    throw err;
  }
}


export async function assignTask(taskId, adminId, serviceId) {
  try {
    const { data: task, error: tErr } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", taskId)
      .single();
    if (tErr) throw tErr;

    const { data, error } = await supabase
      .from("tasks")
      .update({
        admin_id: adminId,
        service_id: serviceId,
        status: "Accepted",
        updated_at: new Date().toISOString(),
      })
      .eq("id", taskId)
      .select()
      .single();
    if (error) throw error;

    await addTaskLog({
      task_id: taskId,
      updated_by: adminId,
      role: "admin",
      old_status: task.status,
      new_status: "Accepted",
      remarks: `Assigned to service ${serviceId}`,
    });

    return data;
  } catch (err) {
    console.error("assignTask error:", err.message);
    throw err;
  }
}


export async function updateTaskStatus(taskId, actorId, newStatus, remarks = "") {
  try {
    const validStatus = ["Pending", "Accepted", "In Progress", "Completed", "Cancelled"];
    if (!validStatus.includes(newStatus)) throw new Error("Invalid status");

    const { data: task, error: tErr } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", taskId)
      .single();
    if (tErr) throw tErr;
    if (!task) throw new Error("Task not found");

    const { data, error } = await supabase
      .from("tasks")
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", taskId)
      .select()
      .single();
    if (error) throw error;

    await addTaskLog({
      task_id: taskId,
      updated_by: actorId,
      role: "system",
      old_status: task.status,
      new_status: newStatus,
      remarks,
    });

    return data;
  } catch (err) {
    console.error("updateTaskStatus error:", err.message);
    throw err;
  }
}


export async function fetchAllTasks() {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function fetchUserTasks(userId) {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function fetchServiceTasks(serviceId) {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("service_id", serviceId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function fetchAdminTasks(adminId) {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("admin_id", adminId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}


export async function addTaskLog({ task_id, updated_by, role, old_status, new_status, remarks = "" }) {
  const { data, error } = await supabase
    .from("task_logs")
    .insert([{ task_id, updated_by, role, old_status, new_status, remarks }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function fetchTaskLogs(taskId) {
  const { data, error } = await supabase
    .from("task_logs")
    .select("*")
    .eq("task_id", taskId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data;
}


export async function createNotification({ receiver_id, sender_id = null, message }) {
  const { data, error } = await supabase
    .from("notifications")
    .insert([{ receiver_id, sender_id, message }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function fetchNotifications(receiverId) {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("receiver_id", receiverId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function markNotificationRead(notificationId) {
  const { data, error } = await supabase
    .from("notifications")
    .update({ read_status: true })
    .eq("id", notificationId)
    .select()
    .single();
  if (error) throw error;
  return data;
}
