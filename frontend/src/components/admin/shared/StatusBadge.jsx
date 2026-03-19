// Reusable colored badge for status fields
// Used in Complaint, Staff, and User tables

function StatusBadge({ status }) {
  const styles = {
    "Pending":          "badge badge-pending",
    "In Progress":      "badge badge-inprogress",
    "Resolved":         "badge badge-resolved",
    "Rejected":         "badge badge-rejected",
    "Reported as Fake": "badge badge-rejected",
    "approved":         "badge badge-resolved",
    "pending":          "badge badge-pending",
    "rejected":         "badge badge-rejected",
  };

  return (
    <span className={styles[status] || "badge"}>
      {status}
    </span>
  );
}

export default StatusBadge;