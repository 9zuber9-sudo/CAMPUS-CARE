export const PRIORITY_ICON = {
  Critical: '🔴',
  High: '🟠',
  Medium: '🟡',
  Low: '🟢',
};

export default function PriorityBadge({ priority }) {
  const cls = `badge badge-${priority?.toLowerCase()}`;
  return (
    <span className={cls}>
      <span className="badge-dot" />
      {priority}
    </span>
  );
}
