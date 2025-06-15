import { Question } from '../interfaces';

export const GET_STARTED_QUESTIONS: Question[] = [
    {
        id: 'purpose',
        title: 'What was the reason for your stay?',
        options: [
            { id: 'family', label: 'Family trip', icon: '👨‍👩‍👧‍👦' },
            { id: 'romantic', label: 'Romantic getaway', icon: '💕' },
            { id: 'business', label: 'Business', icon: '💼' },
        ],
    },
    {
        id: 'duration',
        title: 'How long was your stay?',
        options: [
            { id: 'weekend', label: '1-2 days', icon: '📅' },
            { id: 'week', label: '3-7 days', icon: '🗓️' },
            { id: 'extended', label: 'More than a week', icon: '📆' },
        ],
    },
    {
        id: 'accommodation',
        title: 'What type of accommodation did you prefer?',
        options: [
            { id: 'hotel', label: 'Hotel', icon: '🏨' },
            { id: 'apartment', label: 'Apartment/Airbnb', icon: '🏠' },
            { id: 'resort', label: 'Resort', icon: '🏖️' },
        ],
    },
    {
        id: 'budget',
        title: 'What was your budget range?',
        options: [
            { id: 'budget', label: 'Budget-friendly', icon: '💰' },
            { id: 'mid', label: 'Mid-range', icon: '💵' },
            { id: 'luxury', label: 'Luxury', icon: '💎' },
        ],
    },
    {
        id: 'activities',
        title: 'What activities did you enjoy most?',
        options: [
            { id: 'sightseeing', label: 'Sightseeing', icon: '📸' },
            { id: 'adventure', label: 'Adventure sports', icon: '🏔️' },
            { id: 'relaxation', label: 'Relaxation', icon: '🧘‍♀️' },
        ],
    },
    {
        id: 'dining',
        title: 'How important was dining experience?',
        options: [
            { id: 'very', label: 'Very important', icon: '🍽️' },
            { id: 'somewhat', label: 'Somewhat important', icon: '🍴' },
            { id: 'not', label: 'Not important', icon: '🥪' },
        ],
    },
    {
        id: 'transportation',
        title: 'How did you prefer to get around?',
        options: [
            { id: 'car', label: 'Rental car', icon: '🚗' },
            { id: 'public', label: 'Public transport', icon: '🚌' },
            { id: 'walking', label: 'Walking/Biking', icon: '🚶‍♀️' },
        ],
    },
    {
        id: 'season',
        title: 'What season do you prefer to travel?',
        options: [
            { id: 'spring', label: 'Spring', icon: '🌸' },
            { id: 'summer', label: 'Summer', icon: '☀️' },
            { id: 'winter', label: 'Winter', icon: '❄️' },
        ],
    },
    {
        id: 'planning',
        title: 'How do you prefer to plan your trips?',
        options: [
            { id: 'detailed', label: 'Detailed planning', icon: '📋' },
            { id: 'flexible', label: 'Flexible itinerary', icon: '🗺️' },
            { id: 'spontaneous', label: 'Spontaneous', icon: '🎲' },
        ],
    },
    {
        id: 'future',
        title: 'What type of destination interests you next?',
        options: [
            { id: 'beach', label: 'Beach destination', icon: '🏖️' },
            { id: 'city', label: 'City exploration', icon: '🏙️' },
            { id: 'nature', label: 'Nature/Mountains', icon: '🏔️' },
        ],
    },
];
