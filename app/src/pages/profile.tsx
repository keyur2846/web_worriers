import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "@/stores/auth-store";

export function ProfilePage() {
  const { user, isAuthenticated, updateProfile, signOut } = useAuthStore();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name ?? "",
    role: user?.role ?? "",
    bio: user?.bio ?? "",
    avatar: user?.avatar ?? "",
    linkedin: user?.social.linkedin ?? "",
    instagram: user?.social.instagram ?? "",
    facebook: user?.social.facebook ?? "",
    twitter: user?.social.twitter ?? "",
  });

  if (!isAuthenticated || !user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="glass-panel corner-brackets relative p-8 text-center space-y-5"
      >
        <div className="cb-inner" />
        <div
          className="text-4xl text-[var(--color-accent)] opacity-50"
          style={{ fontFamily: "var(--font-display)" }}
        >
          &#x26A0;
        </div>
        <h2
          className="text-2xl tracking-[0.08em]"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-danger)" }}
        >
          ACCESS DENIED
        </h2>
        <p className="mono-readout text-text-muted">
          Authentication required to view operative profile.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="btn-tactical cursor-pointer"
        >
          Sign In
        </button>
      </motion.div>
    );
  }

  function handleSave() {
    updateProfile({
      name: formData.name,
      role: formData.role,
      bio: formData.bio,
      avatar: formData.avatar,
      social: {
        linkedin: formData.linkedin,
        instagram: formData.instagram,
        facebook: formData.facebook,
        twitter: formData.twitter,
      },
    });
    setIsEditing(false);
  }

  function handleLogout() {
    signOut();
    navigate("/");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="grid md:grid-cols-3 gap-6"
    >
      {/* Profile card */}
      <div className="glass-panel corner-brackets relative p-6 text-center space-y-4">
        <div className="cb-inner" />

        {/* Avatar */}
        <div className="w-24 h-24 mx-auto border-2 border-[var(--color-accent)] flex items-center justify-center overflow-hidden">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span
              className="text-3xl font-bold text-[var(--color-accent)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {user.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        {/* Identity */}
        <div>
          <h2
            className="text-xl tracking-[0.08em]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {user.name.toUpperCase()}
          </h2>
          <span className="label-military mt-2 inline-block">{user.role}</span>
        </div>

        <p
          className="text-text-muted text-xs"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {user.email}
        </p>

        <div className="divider-mil" />

        {/* Actions */}
        <div className="flex gap-2 justify-center pt-1">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-1.5 text-[0.65rem] tracking-[0.1em] uppercase border border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 transition-colors cursor-pointer"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-1.5 text-[0.65rem] tracking-[0.1em] uppercase border border-danger text-danger hover:bg-danger/10 transition-colors cursor-pointer"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Details / Edit form */}
      <div className="md:col-span-2 space-y-6">
        {isEditing ? (
          <div className="glass-panel corner-brackets relative p-6 space-y-5">
            <div className="cb-inner" />
            <div className="flex items-center gap-3 mb-1">
              <div className="w-1 h-5 bg-[var(--color-accent)]" />
              <h3
                className="text-lg tracking-[0.08em]"
                style={{ fontFamily: "var(--font-display)", color: "var(--color-accent)" }}
              >
                EDIT PROFILE
              </h3>
            </div>
            <div className="divider-mil" />

            <EditField
              label="Name"
              value={formData.name}
              onChange={(v) => setFormData({ ...formData, name: v })}
            />
            <EditField
              label="Role / Designation"
              value={formData.role}
              onChange={(v) => setFormData({ ...formData, role: v })}
              placeholder="e.g. Field Commander"
            />
            <EditField
              label="Avatar URL"
              value={formData.avatar}
              onChange={(v) => setFormData({ ...formData, avatar: v })}
              placeholder="https://..."
            />
            <div>
              <label className="mono-readout text-text-muted block mb-2">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                rows={3}
                className="w-full bg-bg-alt border border-border px-4 py-2.5 text-sm text-text focus:outline-none transition-colors resize-none"
                placeholder="Tell us about your mission..."
              />
            </div>

            <div className="divider-mil" />
            <div className="flex items-center gap-3">
              <div className="w-1 h-4 bg-[var(--color-accent)] opacity-50" />
              <span
                className="text-[0.6rem] tracking-[0.15em] uppercase text-text-muted"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Social Links
              </span>
            </div>

            <EditField
              label="LinkedIn"
              value={formData.linkedin}
              onChange={(v) => setFormData({ ...formData, linkedin: v })}
              placeholder="https://linkedin.com/in/..."
            />
            <EditField
              label="Instagram"
              value={formData.instagram}
              onChange={(v) => setFormData({ ...formData, instagram: v })}
              placeholder="@username"
            />
            <EditField
              label="Facebook"
              value={formData.facebook}
              onChange={(v) => setFormData({ ...formData, facebook: v })}
              placeholder="https://facebook.com/..."
            />
            <EditField
              label="Twitter / X"
              value={formData.twitter}
              onChange={(v) => setFormData({ ...formData, twitter: v })}
              placeholder="@username"
            />

            <button
              onClick={handleSave}
              className="w-full btn-tactical cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        ) : (
          <>
            {/* Bio */}
            <div className="glass-panel corner-brackets relative p-6 space-y-3">
              <div className="cb-inner" />
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 bg-[var(--color-accent)]" />
                <h3
                  className="text-lg tracking-[0.08em]"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "var(--color-accent)",
                  }}
                >
                  BIO
                </h3>
              </div>
              <p className="text-text-muted leading-relaxed text-sm pl-4 border-l border-border">
                {user.bio || "No bio set. Click 'Edit' to add one."}
              </p>
            </div>

            {/* Social Links */}
            <div className="glass-panel corner-brackets relative p-6 space-y-3">
              <div className="cb-inner" />
              <div className="flex items-center gap-3 mb-1">
                <div className="w-1 h-5 bg-[var(--color-accent)]" />
                <h3
                  className="text-lg tracking-[0.08em]"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "var(--color-accent)",
                  }}
                >
                  SOCIAL LINKS
                </h3>
              </div>
              <div className="space-y-2">
                <SocialLink label="LinkedIn" value={user.social.linkedin} />
                <SocialLink label="Instagram" value={user.social.instagram} />
                <SocialLink label="Facebook" value={user.social.facebook} />
                <SocialLink
                  label="Twitter / X"
                  value={user.social.twitter}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

function EditField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mono-readout text-text-muted block mb-2">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-bg-alt border border-border px-4 py-2.5 text-sm text-text placeholder:text-text-muted/40 focus:outline-none transition-colors"
      />
    </div>
  );
}

function SocialLink({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-baseline py-2 border-b border-border/30 last:border-b-0">
      <span className="mono-readout text-text-muted">{label}</span>
      {value ? (
        <a
          href={value.startsWith("http") ? value : `https://${value}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mono-readout text-[var(--color-accent)] hover:underline underline-offset-2"
        >
          {value}
        </a>
      ) : (
        <span className="mono-readout text-text-muted opacity-30">
          — Not set
        </span>
      )}
    </div>
  );
}
