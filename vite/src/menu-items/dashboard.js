import { IconDashboard } from '@tabler/icons-react';

const dashboard = {
  id: 'dashboard',
  title: '대시보드',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: '대시보드',
      type: 'item',
      url: '/dashboard',
      icon: IconDashboard,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
