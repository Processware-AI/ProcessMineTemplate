import { IconSettings } from '@tabler/icons-react';

const settings = {
  id: 'settings-group',
  title: '설정',
  type: 'group',
  children: [
    {
      id: 'settings',
      title: '시스템 설정',
      type: 'item',
      url: '/settings',
      icon: IconSettings,
      breadcrumbs: true
    }
  ]
};

export default settings;
