import React from "react";

export default function MailAvatar({ name, picture, onClick, size }) {
  const getInitials = (name) => {
    if (!name) return "";
    return name.charAt(0).toUpperCase();
  };

  // Calculate styles based on size
  const styles = {
    container: {
      width: `${size}px`,
      minWidth: "32px",
      height: `${size}px`,
      borderRadius: "50%",
      overflow: "hidden",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      cursor: "pointer", // Ensure the cursor changes to pointer
      backgroundColor: "#f0f0f0", // Light gray background for initials
    },
    image: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      opacity: "0.8",
      imageResolution: "300dpi",
      objectPosition: "center",
      filter: "invert(2%)",
      filter: "contrast(110%)",
    },
    initials: {
      fontSize: `${size / 2}px`,
      color: "#fff",
      fontWeight: "bold",
      backgroundColor: "#ef9a3e",
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
  };

  return (
    <div style={styles.container} onClick={onClick}>
      {picture ? (
        <img src={picture} alt="Profile" style={styles.image} />
      ) : (
        <div style={styles.initials}>{getInitials(name)}</div>
      )}
    </div>
  );
}
