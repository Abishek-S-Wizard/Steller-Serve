
import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import "./ProfileManagement.css";

export default function ProfileManagement() {
  const [profile, setProfile] = useState({
    id: null,
    name: "",
    email: "",
    phone: "",
    role: "service",       
    servicetype: "",
    experience: "",
    address: "",            
  });

  const [password, setPassword] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const fetchProfile = async () => {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData.user) {
        console.error("Auth error:", authError);
        setLoading(false);
        return;
      }

      const { id } = authData.user;
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, email, phone, role, servicetype, experience, address")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error.message);
      } else if (data) {
        setProfile(data);
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const authUser = (await supabase.auth.getUser()).data.user;
      if (!authUser) throw new Error("Auth user not found");

      
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          servicetype: profile.servicetype,
          experience: profile.experience,
          address: profile.address,   
        })
        .eq("id", authUser.id);

      if (updateError) throw updateError;

      
      if (password || profile.email !== authUser.email) {
        const { error: authError } = await supabase.auth.updateUser({
          email: profile.email,
          ...(password && { password }),
        });
        if (authError) throw authError;
        if (password) setPassword("");
      }

      alert("✅ Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("❌ Error updating profile:", error.message);
      alert("❌ Update failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>⏳ Loading...</p>;

  return (
    <div className="profile-container">
      <h2>⚙️ Service Profile Management</h2>

      {!isEditing ? (
        <div className="profile-view">
          <p><strong>Full Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Phone:</strong> {profile.phone}</p>
          {profile.role === "service" && (
            <>
              <p><strong>Service Type:</strong> {profile.servicetype}</p>
              <p><strong>Experience:</strong> {profile.experience}</p>
              <p><strong>Location:</strong> {profile.address}</p>
            </>
          )}
          <button className="edit-btn" onClick={() => setIsEditing(true)}>✏️ Edit</button>
        </div>
      ) : (
        <form onSubmit={handleSave} className="profile-form">
          <label>Full Name:</label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            required
          />

          <label>Email:</label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            required
          />

          <label>Phone:</label>
          <input
            type="text"
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            required
          />

          {profile.role === "service" && (
            <>
              <label>Service Type:</label>
              <input
                type="text"
                value={profile.servicetype}
                onChange={(e) => setProfile({ ...profile, servicetype: e.target.value })}
              />
              <label>Experience:</label>
              <input
                type="text"
                value={profile.experience}
                onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
              />
              <label>Location:</label>
              <input
                type="text"
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              />
            </>
          )}

          <label>Change Password:</label>
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="btn-row">
            <button type="submit" className="save-btn">💾 Save</button>
            <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>❌ Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
}
