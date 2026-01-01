// src/types/event.ts

export interface EventSanityData {
  title: string;              // GUIDELINE: Event Name (Not location name)
  slug: string;
  description: string;        // GUIDELINE: Concise details
  mainImage?: any;            // GUIDELINE: 16x9, 4x3, or 1x1 preferred
  startDate: string;          // GUIDELINE: ISO-8601
  endDate?: string;           // GUIDELINE: Recommended if known
  isAllDay?: boolean;         // GUIDELINE: Helps avoid "00:00:00" errors
  
  // Status Handling
  status: 'scheduled' | 'cancelled' | 'postponed' | 'rescheduled';
  previousStartDate?: string; // GUIDELINE: Required only if rescheduled
  
  // Location (Physical only per guidelines)
  locationName: string;       // GUIDELINE: Venue Name (e.g., "Snickerpark Stadium")
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };

  // Ticket / Offers
  ticketPrice?: number;
  currency?: string;
  ticketUrl?: string;
  isTicketAvailable?: boolean;

  // Organizer
  organizerName?: string;
  organizerUrl?: string;
}