// src/hooks/useInterviews.js
import { useState, useEffect } from 'react';

export function useInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Replace this with API call
    setTimeout(() => {
      setInterviews([
        {
          id: 1,
          scheduled_at: new Date().toISOString(),
          status: 'scheduled',
          job: { title: 'Frontend Developer', company: 'Tech Corp' },
          location: 'Zoom',
          interview_type: 'Online',
        },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  return { interviews, isLoading };
}
