import { Question } from '../interfaces';

export const GET_STARTED_QUESTIONS: Question[] = [
    {
        id: 'energy_pattern',
        title: 'When do you feel most productive during the day?',
        options: [
            { id: 'morning', label: 'Early morning (6-9 AM)', icon: '🌅' },
            { id: 'midday', label: 'Mid-day (10 AM-2 PM)', icon: '☀️' },
            { id: 'evening', label: 'Evening (3-8 PM)', icon: '🌆' },
        ],
    },
    {
        id: 'task_preference',
        title: 'How do you prefer to tackle your tasks?',
        options: [
            { id: 'sequential', label: 'One task at a time', icon: '📝' },
            { id: 'batch', label: 'Similar tasks together', icon: '📚' },
            { id: 'mixed', label: 'Mix different types', icon: '🔄' },
        ],
    },
    {
        id: 'priority_method',
        title: 'How do you typically prioritize your tasks?',
        options: [
            { id: 'deadline', label: 'By deadlines', icon: '⏰' },
            { id: 'importance', label: 'By importance', icon: '⭐' },
            { id: 'difficulty', label: 'By difficulty level', icon: '🎯' },
        ],
    },
    {
        id: 'work_duration',
        title: "What's your ideal work session length?",
        options: [
            { id: 'short', label: '25-30 minutes', icon: '⏲️' },
            { id: 'medium', label: '45-60 minutes', icon: '🕐' },
            { id: 'long', label: '90+ minutes', icon: '⏳' },
        ],
    },
    {
        id: 'break_style',
        title: 'What type of breaks help you recharge?',
        options: [
            { id: 'active', label: 'Physical activity', icon: '🚶‍♀️' },
            { id: 'social', label: 'Social interaction', icon: '💬' },
            { id: 'quiet', label: 'Quiet time alone', icon: '🧘‍♀️' },
        ],
    },
    {
        id: 'distraction_level',
        title: 'How easily do you get distracted?',
        options: [
            { id: 'low', label: 'Rarely distracted', icon: '🎯' },
            { id: 'moderate', label: 'Sometimes distracted', icon: '⚖️' },
            { id: 'high', label: 'Easily distracted', icon: '🦋' },
        ],
    },
    {
        id: 'planning_style',
        title: 'How far ahead do you like to plan?',
        options: [
            { id: 'daily', label: 'Day by day', icon: '📅' },
            { id: 'weekly', label: 'Week by week', icon: '🗓️' },
            { id: 'monthly', label: 'Monthly planning', icon: '📆' },
        ],
    },
    {
        id: 'motivation_source',
        title: 'What motivates you most to complete tasks?',
        options: [
            { id: 'progress', label: 'Seeing progress', icon: '📊' },
            { id: 'rewards', label: 'Rewards/incentives', icon: '🏆' },
            { id: 'accountability', label: 'External accountability', icon: '👥' },
        ],
    },
    {
        id: 'environment',
        title: 'Where do you work most effectively?',
        options: [
            { id: 'quiet', label: 'Quiet, private space', icon: '🏠' },
            { id: 'ambient', label: 'With background noise', icon: '☕' },
            { id: 'collaborative', label: 'Around other people', icon: '👥' },
        ],
    },
    {
        id: 'challenge_response',
        title: 'How do you handle difficult or overwhelming tasks?',
        options: [
            { id: 'break_down', label: 'Break into smaller steps', icon: '🧩' },
            { id: 'tackle_first', label: 'Do them first', icon: '💪' },
            { id: 'build_up', label: 'Start with easier tasks', icon: '🪜' },
        ],
    },
];
