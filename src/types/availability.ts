export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
export type AvailabilityType = 'available' | 'unavailable'
export type RecurringPatternType = 'weekdays' | 'weekly' | 'daily' | 'weekends'
export type SpecificPatternType = 'once' | 'date_range'

// Base interface with common properties
interface BaseAvailability {
    type: AvailabilityType
    startTime: string
    endTime: string
    id: number
    createdAt: string
}

// Recurring availability (weekly patterns)
export interface RecurringAvailability extends BaseAvailability {
    pattern: RecurringPatternType
    daysOfWeek: DayOfWeek[]
}

// Specific availability (one-time or date range)
export interface SpecificAvailability extends BaseAvailability {
    pattern: SpecificPatternType
    startDate: string
    endDate: string
}

// Union type for all availability types
export type Availability = RecurringAvailability | SpecificAvailability
export type AvailabilityArray = Availability[]
