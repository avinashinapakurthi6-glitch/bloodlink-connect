/**
 * API Service Layer
 * Centralized API call handling with proper error management
 */

import { supabase } from '@/lib/supabase/client';

// Type definitions
export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
  success: boolean;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

/**
 * Generic error handler
 */
const handleError = (error: unknown): ApiError => {
  if (error instanceof Error) {
    return {
      code: 'ERROR',
      message: error.message,
    };
  }

  if (typeof error === 'object' && error !== null && 'message' in error) {
    return {
      code: 'ERROR',
      message: String((error as Record<string, unknown>).message),
    };
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: 'An unexpected error occurred',
  };
};

/**
 * Wrapper for async API calls with error handling
 */
export const apiCall = async <T>(
  fn: () => Promise<T>
): Promise<ApiResponse<T>> => {
  try {
    const data = await fn();
    return {
      data,
      error: null,
      success: true,
    };
  } catch (error) {
    return {
      data: null,
      error: handleError(error),
      success: false,
    };
  }
};

// ============================================================================
// Blood Inventory Services
// ============================================================================

export interface BloodInventory {
  id: string;
  blood_type: string;
  units: number;
  location: string;
  updated_at: string;
}

export const bloodInventoryService = {
  async fetchAll(): Promise<ApiResponse<BloodInventory[]>> {
    return apiCall(async () => {
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .order('blood_type');

      if (error) throw error;
      return data || [];
    });
  },

  async fetchByType(bloodType: string): Promise<ApiResponse<BloodInventory>> {
    return apiCall(async () => {
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .eq('blood_type', bloodType)
        .single();

      if (error) throw error;
      return data;
    });
  },

  async update(
    id: string,
    units: number
  ): Promise<ApiResponse<BloodInventory>> {
    return apiCall(async () => {
      const { data, error } = await supabase
        .from('inventory')
        .update({ units, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    });
  },
};

// ============================================================================
// Queue Services
// ============================================================================

export interface QueueItem {
  id: string;
  patient_name: string;
  blood_type: string;
  hospital: string;
  position: number;
  status: 'pending' | 'in_progress' | 'completed';
  created_at: string;
}

export const queueService = {
  async fetchAll(): Promise<ApiResponse<QueueItem[]>> {
    return apiCall(async () => {
      const { data, error } = await supabase
        .from('queue')
        .select('*')
        .order('position');

      if (error) throw error;
      return data || [];
    });
  },

  async updateStatus(
    id: string,
    status: QueueItem['status']
  ): Promise<ApiResponse<QueueItem>> {
    return apiCall(async () => {
      const { data, error } = await supabase
        .from('queue')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    });
  },
};

// ============================================================================
// Donor Services
// ============================================================================

export interface Donor {
  id: string;
  name: string;
  email: string;
  phone: string;
  blood_type: string;
  location: string;
  total_donations: number;
  created_at: string;
}

export const donorService = {
  async register(donor: Omit<Donor, 'id' | 'total_donations' | 'created_at'>): Promise<ApiResponse<Donor>> {
    return apiCall(async () => {
      const { data, error } = await supabase
        .from('donors')
        .insert([
          {
            ...donor,
            total_donations: 0,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    });
  },

  async fetchAll(): Promise<ApiResponse<Donor[]>> {
    return apiCall(async () => {
      const { data, error } = await supabase
        .from('donors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    });
  },
};

// ============================================================================
// Alert Services
// ============================================================================

export interface Alert {
  blood_type: string;
  units: number;
  location: string;
  severity: 'critical' | 'low' | 'normal';
}

export const alertService = {
  async fetchAlerts(): Promise<ApiResponse<Alert[]>> {
    return apiCall(async () => {
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .order('units');

      if (error) throw error;

      return (data || []).map((item) => ({
        blood_type: item.blood_type,
        units: item.units,
        location: item.location,
        severity:
          item.units <= 5 ? 'critical' : item.units <= 15 ? 'low' : 'normal',
      }));
    });
  },
};

// ============================================================================
// Certificate Services
// ============================================================================

export interface Certificate {
  id: string;
  donor_name: string;
  blood_type: string;
  donation_date: string;
  hospital: string;
  certificate_number: string;
}

export const certificateService = {
  async fetchAll(): Promise<ApiResponse<Certificate[]>> {
    return apiCall(async () => {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .order('donation_date', { ascending: false });

      if (error) throw error;
      return data || [];
    });
  },
};

// ============================================================================
// Event Services
// ============================================================================

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  event_date: string;
  start_time: string;
  end_time: string;
  organizer: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

export const eventService = {
  async fetchAll(): Promise<ApiResponse<Event[]>> {
    return apiCall(async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date');

      if (error) throw error;
      return data || [];
    });
  },
};
