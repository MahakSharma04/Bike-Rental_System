import React from 'react';
import { Loader2 } from 'lucide-react';

const SpinnerOverlay = ({ fullScreen = false }) => {
  return (
    <div className={`flex items-center justify-center ${fullScreen ? 'fixed inset-0 bg-white/80 z-50' : 'absolute inset-0 bg-white/70 z-10'}`}>
      <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
    </div>
  );
};

export default SpinnerOverlay; 