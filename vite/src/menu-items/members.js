import { IconUsers, IconSchool } from '@tabler/icons-react';

const members = {
  id: 'members-group',
  title: '회원',
  type: 'group',
  children: [
    {
      id: 'members',
      title: '회원 관리',
      type: 'item',
      url: '/members',
      icon: IconUsers,
      breadcrumbs: true
    },
    {
      id: 'cohorts',
      title: '기수 관리',
      type: 'item',
      url: '/cohorts',
      icon: IconSchool,
      breadcrumbs: true
    }
  ]
};

export default members;
