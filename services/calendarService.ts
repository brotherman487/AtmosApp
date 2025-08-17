import { Platform } from 'react-native';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  calendarType: 'google' | 'apple' | 'outlook';
  isAllDay: boolean;
  attendees?: string[];
  recurrence?: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export interface CalendarIntegration {
  type: 'google' | 'apple' | 'outlook';
  connected: boolean;
  lastSync: Date;
  eventsCount: number;
}

class CalendarService {
  private static instance: CalendarService;
  private integrations: CalendarIntegration[] = [];
  private events: CalendarEvent[] = [];

  constructor() {
    this.initializeIntegrations();
  }

  static getInstance(): CalendarService {
    if (!CalendarService.instance) {
      CalendarService.instance = new CalendarService();
    }
    return CalendarService.instance;
  }

  private initializeIntegrations() {
    this.integrations = [
      {
        type: 'google',
        connected: false,
        lastSync: new Date(),
        eventsCount: 0,
      },
      {
        type: 'apple',
        connected: Platform.OS === 'ios',
        lastSync: new Date(),
        eventsCount: 0,
      },
      {
        type: 'outlook',
        connected: false,
        lastSync: new Date(),
        eventsCount: 0,
      },
    ];
  }

  // Connect to calendar services
  async connectGoogleCalendar(): Promise<boolean> {
    try {
      // Simulate Google Calendar API connection
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const googleIntegration = this.integrations.find(i => i.type === 'google');
      if (googleIntegration) {
        googleIntegration.connected = true;
        googleIntegration.lastSync = new Date();
        googleIntegration.eventsCount = 15; // Sample data
      }
      
      return true;
    } catch (error) {
      console.error('Failed to connect to Google Calendar:', error);
      return false;
    }
  }

  async connectOutlookCalendar(): Promise<boolean> {
    try {
      // Simulate Outlook Calendar API connection
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const outlookIntegration = this.integrations.find(i => i.type === 'outlook');
      if (outlookIntegration) {
        outlookIntegration.connected = true;
        outlookIntegration.lastSync = new Date();
        outlookIntegration.eventsCount = 8; // Sample data
      }
      
      return true;
    } catch (error) {
      console.error('Failed to connect to Outlook Calendar:', error);
      return false;
    }
  }

  // Fetch events from all connected calendars
  async fetchEvents(startDate: Date, endDate: Date): Promise<CalendarEvent[]> {
    const events: CalendarEvent[] = [];
    
    for (const integration of this.integrations) {
      if (integration.connected) {
        const calendarEvents = await this.fetchEventsFromCalendar(
          integration.type,
          startDate,
          endDate
        );
        events.push(...calendarEvents);
      }
    }
    
    this.events = events;
    return events;
  }

  private async fetchEventsFromCalendar(
    type: 'google' | 'apple' | 'outlook',
    startDate: Date,
    endDate: Date
  ): Promise<CalendarEvent[]> {
    // Simulate fetching events from different calendar types
    const sampleEvents: CalendarEvent[] = [
      {
        id: `1-${type}`,
        title: 'Team Meeting',
        description: 'Weekly team sync',
        startTime: new Date(startDate.getTime() + 2 * 60 * 60 * 1000), // 2 hours from start
        endTime: new Date(startDate.getTime() + 3 * 60 * 60 * 1000), // 3 hours from start
        calendarType: type,
        isAllDay: false,
        attendees: ['john@company.com', 'jane@company.com'],
      },
      {
        id: `2-${type}`,
        title: 'Lunch Break',
        description: 'Time for lunch',
        startTime: new Date(startDate.getTime() + 4 * 60 * 60 * 1000), // 4 hours from start
        endTime: new Date(startDate.getTime() + 5 * 60 * 60 * 1000), // 5 hours from start
        calendarType: type,
        isAllDay: false,
      },
      {
        id: `3-${type}`,
        title: 'Project Review',
        description: 'Review project progress',
        startTime: new Date(startDate.getTime() + 6 * 60 * 60 * 1000), // 6 hours from start
        endTime: new Date(startDate.getTime() + 7 * 60 * 60 * 1000), // 7 hours from start
        calendarType: type,
        isAllDay: false,
        attendees: ['manager@company.com'],
      },
    ];

    return sampleEvents;
  }

  // Get events for today
  async getTodayEvents(): Promise<CalendarEvent[]> {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    
    return this.fetchEvents(startOfDay, endOfDay);
  }

  // Get events for the next 7 days
  async getWeekEvents(): Promise<CalendarEvent[]> {
    const today = new Date();
    const endOfWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return this.fetchEvents(today, endOfWeek);
  }

  // Get upcoming events (next 2 hours)
  async getUpcomingEvents(): Promise<CalendarEvent[]> {
    const now = new Date();
    const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    
    return this.events.filter(event => 
      event.startTime >= now && event.startTime <= twoHoursFromNow
    );
  }

  // Check for conflicts with suggested activities
  checkConflicts(suggestedTime: Date, duration: number): CalendarEvent[] {
    const endTime = new Date(suggestedTime.getTime() + duration * 60 * 1000);
    
    return this.events.filter(event => 
      (event.startTime < endTime && event.endTime > suggestedTime) ||
      (event.startTime >= suggestedTime && event.startTime < endTime)
    );
  }

  // Get free time slots
  getFreeTimeSlots(date: Date, duration: number = 60): Date[] {
    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 9, 0, 0);
    const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 17, 0, 0);
    
    const dayEvents = this.events.filter(event => 
      event.startTime.toDateString() === date.toDateString()
    );
    
    const freeSlots: Date[] = [];
    let currentTime = new Date(dayStart);
    
    while (currentTime < dayEnd) {
      const slotEnd = new Date(currentTime.getTime() + duration * 60 * 1000);
      const conflicts = this.checkConflicts(currentTime, duration);
      
      if (conflicts.length === 0) {
        freeSlots.push(new Date(currentTime));
      }
      
      currentTime = new Date(currentTime.getTime() + 30 * 60 * 1000); // Move 30 minutes forward
    }
    
    return freeSlots;
  }

  // Get integration status
  getIntegrations(): CalendarIntegration[] {
    return this.integrations;
  }

  // Disconnect from a calendar
  async disconnectCalendar(type: 'google' | 'apple' | 'outlook'): Promise<boolean> {
    const integration = this.integrations.find(i => i.type === type);
    if (integration) {
      integration.connected = false;
      integration.eventsCount = 0;
      return true;
    }
    return false;
  }

  // Sync all connected calendars
  async syncAllCalendars(): Promise<void> {
    const today = new Date();
    const endOfWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    for (const integration of this.integrations) {
      if (integration.connected) {
        await this.fetchEventsFromCalendar(integration.type, today, endOfWeek);
        integration.lastSync = new Date();
      }
    }
  }

  // Get calendar analytics
  getCalendarAnalytics() {
    const totalEvents = this.events.length;
    const todayEvents = this.events.filter(event => 
      event.startTime.toDateString() === new Date().toDateString()
    ).length;
    
    const busyHours = this.getBusyHours();
    const freeTime = this.getFreeTimeSlots(new Date()).length;
    
    return {
      totalEvents,
      todayEvents,
      busyHours,
      freeTime,
      connectedCalendars: this.integrations.filter(i => i.connected).length,
    };
  }

  private getBusyHours(): number {
    const today = new Date();
    const todayEvents = this.events.filter(event => 
      event.startTime.toDateString() === today.toDateString()
    );
    
    return todayEvents.reduce((total, event) => {
      const duration = (event.endTime.getTime() - event.startTime.getTime()) / (1000 * 60 * 60);
      return total + duration;
    }, 0);
  }
}

export const calendarService = CalendarService.getInstance();
export default CalendarService;
