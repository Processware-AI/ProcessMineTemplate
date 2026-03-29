import { IconCalendarEvent, IconClipboardCheck } from '@tabler/icons-react';

const education = {
  id: 'education-group',
  title: '교육',
  type: 'group',
  children: [
    {
      id: 'sessions',
      title: '교육 일정',
      type: 'item',
      url: '/sessions',
      icon: IconCalendarEvent,
      breadcrumbs: true
    },
    {
      id: 'attendance',
      title: '출결 관리',
      type: 'item',
      url: '/attendance',
      icon: IconClipboardCheck,
      breadcrumbs: true
    }
  ]
};

export default education;
