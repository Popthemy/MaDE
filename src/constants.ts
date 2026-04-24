import { Template } from './types';

export const BRAND_COLORS = {
  primary: '#7C3AED',   // Purple
  accent: '#22C55E',    // Bright Green
  secondary: '#0EA5E9', // Electric Blue
  background: '#FFFFFF', // White
  border: 'rgba(0, 0, 0, 0.1)',
};

export const DEFAULT_CANVAS_SIZE = 1080;

export const SAMPLE_TEMPLATES: Record<string, Template> = {
  birthday: {
    id: 'sample-birthday',
    name: 'Birthday Celebration',
    width: 1080,
    height: 1080,
    category: 'Celebrations',
    description: 'Perfect for church birthdays and office celebrations.',
    tags: ['Most used', 'Bulk-friendly'],
    thumbnail: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=400&auto=format&fit=crop',
    backgroundUrl: 'https://images.unsplash.com/photo-1530103862676-fa8c91bbebdd?q=80&w=1080&auto=format&fit=crop',
    sampleData: {
      name: 'Sarah Adebayo',
      photo: 'https://picsum.photos/seed/sarah/800/800',
    },
    placeholders: [
      {
        id: 'b-p1',
        type: 'text',
        key: 'name',
        label: 'Recipient Name',
        x: 100,
        y: 800,
        width: 880,
        height: 120,
        fontSize: 100,
        fontFamily: 'Inter',
        fill: '#FFFFFF',
        align: 'center',
      },
      {
        id: 'b-p2',
        type: 'image',
        key: 'photo',
        label: 'Member Photo',
        x: 290,
        y: 150,
        width: 500,
        height: 500,
      }
    ]
  },
  certificate: {
    id: 'sample-cert',
    name: 'Excellence Certificate',
    width: 1080,
    height: 760,
    category: 'Certificates',
    description: 'Automatically generate award certificates with high precision.',
    tags: ['Fastest setup'],
    thumbnail: 'https://images.unsplash.com/photo-1589330273594-fade1ee91647?q=80&w=400&auto=format&fit=crop',
    backgroundUrl: 'https://images.unsplash.com/photo-1513258496099-48168024adb0?q=80&w=1080&auto=format&fit=crop',
    sampleData: {
      name: 'John Doe',
      course: 'Full Stack Development',
    },
    placeholders: [
      {
        id: 'c-p1',
        type: 'text',
        key: 'name',
        label: 'Awardee Name',
        x: 50,
        y: 450,
        width: 980,
        height: 80,
        fontSize: 70,
        fontFamily: 'Inter',
        fill: '#141414',
        align: 'center',
      },
      {
        id: 'c-p2',
        type: 'text',
        key: 'course',
        label: 'Course Name',
        x: 50,
        y: 550,
        width: 980,
        height: 40,
        fontSize: 30,
        fontFamily: 'Inter',
        fill: '#444444',
        align: 'center',
      }
    ]
  },
  member: {
    id: 'sample-member',
    name: 'New Member Welcome',
    width: 1080,
    height: 1350,
    category: 'Community',
    description: 'Instantly welcome new team members with branded assets.',
    tags: ['Community favorite'],
    thumbnail: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=400&auto=format&fit=crop',
    backgroundUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1080&auto=format&fit=crop',
    sampleData: {
      name: 'Emeka Obi',
      photo: 'https://picsum.photos/seed/emeka/800/800',
    },
    placeholders: [
      {
        id: 'm-p1',
        type: 'text',
        key: 'name',
        label: 'Full Name',
        x: 100,
        y: 1100,
        width: 880,
        height: 100,
        fontSize: 80,
        fontFamily: 'Inter',
        fill: '#FFFFFF',
        align: 'center',
      },
      {
        id: 'm-p2',
        type: 'image',
        key: 'photo',
        label: 'Avatar',
        x: 140,
        y: 200,
        width: 800,
        height: 800,
      }
    ]
  },
  announcement: {
    id: 'sample-announcement',
    name: 'Weekly Announcement',
    width: 1080,
    height: 1080,
    category: 'Announcements',
    description: 'Clean layouts for weekly updates and community meetups.',
    tags: ['Minimalist'],
    thumbnail: 'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?q=80&w=400&auto=format&fit=crop',
    backgroundUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1080&auto=format&fit=crop',
    sampleData: {
      title: 'Monthly Hackathon',
      date: 'Saturday, 25th May',
    },
    placeholders: [
      {
        id: 'a-p1',
        type: 'text',
        key: 'title',
        label: 'Subject Head',
        x: 100,
        y: 400,
        width: 880,
        height: 120,
        fontSize: 100,
        fontFamily: 'Inter',
        fill: '#FFFFFF',
        align: 'center',
      },
      {
        id: 'a-p2',
        type: 'text',
        key: 'date',
        label: 'Date/Time',
        x: 100,
        y: 550,
        width: 880,
        height: 60,
        fontSize: 40,
        fontFamily: 'Inter',
        fill: '#0EA5E9',
        align: 'center',
      }
    ]
  }
};

export const DEFAULT_PLACEHOLDERS = [
  {
    id: 'placeholder-name',
    type: 'text',
    key: 'name',
    label: 'Primary Name',
    x: 100,
    y: 800,
    width: 880,
    height: 100,
    fontSize: 80,
    fontFamily: 'Inter',
    fill: '#FFFFFF',
    align: 'center',
  },
  {
    id: 'placeholder-dept',
    type: 'text',
    key: 'department',
    label: 'Secondary Detail',
    x: 100,
    y: 920,
    width: 880,
    height: 60,
    fontSize: 40,
    fontFamily: 'Inter',
    fill: '#0EA5E9',
    align: 'center',
  },
  {
    id: 'placeholder-photo',
    type: 'image',
    key: 'photo',
    label: 'Main Image',
    x: 290,
    y: 200,
    width: 500,
    height: 500,
  }
];

export const INITIAL_TEMPLATE: { width: number; height: number; placeholders: any[]; backgroundUrl?: string } = {
  width: DEFAULT_CANVAS_SIZE,
  height: DEFAULT_CANVAS_SIZE,
  placeholders: []
};
