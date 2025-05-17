import React, { useState, useEffect, useRef } from "react";

export default function MailRecipients({
  recipients,
  label,
  userDetails,
  props,
}) {
  const [expanded, setExpanded] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);
  const containerRef = useRef(null);

  useEffect(() => {
    const calculateVisibleCount = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const approxButtonWidth = 75; // Approx width of each recipient button
        const paddingOffset = 50; // Allowance for padding, label, and Show More button

        const maxCount = Math.floor(
          (containerWidth - paddingOffset) / approxButtonWidth
        );
        setVisibleCount(maxCount > 0 ? maxCount : 1);
      }
    };

    calculateVisibleCount();
    window.addEventListener("resize", calculateVisibleCount);
    return () => window.removeEventListener("resize", calculateVisibleCount);
  }, [recipients, props.extendDetailsToggle]);

  if (!recipients || recipients.length === 0) return null;

  return (
    <div className="toString" ref={containerRef}>
      <span style={{ fontSize: "11px", paddingRight: "5px" }}>{label}:</span>
      {recipients
        .slice(0, expanded ? recipients.length : visibleCount)
        .map((recipient, index) => (
          <React.Fragment key={recipient.emailAddress?.address}>
            <button
              className="mail_recepients_btn"
              onClick={() => userDetails(recipient?.emailAddress)}
              title={recipient.emailAddress?.address} // Tooltip for full email
            >
              {recipient.emailAddress?.name || recipient.emailAddress?.address}
              {index < recipients.length - 1 ? ";" : ""}
            </button>
          </React.Fragment>
        ))}

      {/* Show More / Show Less Button */}
      {recipients.length > visibleCount && (
        <button
          className="show-more-btn"
          onClick={() => setExpanded(!expanded)}
          style={{
            marginLeft: "5px",
            fontSize: "11px",
            color: "#ef9a3e",
            background: "none",
            border: "none",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          {expanded
            ? "Show Less"
            : `+${recipients.length - visibleCount} other`}
        </button>
      )}
    </div>
  );
}
