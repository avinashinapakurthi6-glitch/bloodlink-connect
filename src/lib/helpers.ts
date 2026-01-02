/**
 * Common utility functions
 */

/**
 * Get severity level based on units
 */
export const getSeverityLevel = (units: number): 'critical' | 'low' | 'normal' => {
  if (units <= 5) return 'critical';
  if (units <= 15) return 'low';
  return 'normal';
};

/**
 * Format date to readable string
 */
export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format time to readable string
 */
export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

/**
 * Validate email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

/**
 * Get blood type category
 */
export const getBloodTypeCategory = (bloodType: string): 'positive' | 'negative' => {
  return bloodType.includes('+') ? 'positive' : 'negative';
};

/**
 * Format blood type for display
 */
export const formatBloodType = (bloodType: string): string => {
  return bloodType.toUpperCase();
};
