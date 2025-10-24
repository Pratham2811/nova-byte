import React from 'react';
import { UserCog } from 'lucide-react'; // Import necessary icon

/**
 * Reusable component to display a single row of user profile information.
 * It features a left neon border and uses the defined color schemes.
 */
const ProfileDetail = ({ label, value, icon: Icon, neonColor }) => (
  <div className="flex justify-between items-center p-3 bg-gray-900/50 rounded-lg border-l-4 border-l-current transition-shadow duration-300 hover:shadow-cyan-400/30" 
       // Note: Dynamic style for border color is necessary when using Tailwind's JIT/AOT
       style={{ borderColor: neonColor === 'cyan-400' ? 'var(--tw-colors-cyan-400)' : 'var(--tw-colors-fuchsia-400)' }}
  >
    <p className="text-gray-400 text-xs font-mono uppercase tracking-widest">{label}</p>
    <div className="flex items-center gap-2">
      {Icon && <Icon size={18} className={`text-${neonColor}`} />}
      <p className={`text-sm sm:text-base font-medium text-white`}>{value}</p>
    </div>
  </div>
);

// We need to export this component for use in ProfilePage
export default ProfileDetail; 