const STATUS_LABELS = {
  reported:   'Reported',
  assigned:   'Assigned',
  responding: 'Responding',
  resolved:   'Resolved',
};

export default function StatusBadge({ status }) {
  const cls = `badge badge-${status}`;
  return (
    <span className={cls}>
      <span className="badge-dot" />
      {STATUS_LABELS[status] || status}
    </span>
  );
}
