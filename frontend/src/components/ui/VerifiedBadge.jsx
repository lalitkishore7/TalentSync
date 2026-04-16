import { ShieldCheck } from 'lucide-react';
import './VerifiedBadge.css';

export default function VerifiedBadge({ size = 'md', showLabel = false }) {
  return (
    <span className={`verified-badge verified-badge--${size}`} title="Government Verified Company">
      <ShieldCheck size={size === 'sm' ? 12 : size === 'lg' ? 20 : 14} />
      {showLabel && <span>Verified</span>}
    </span>
  );
}