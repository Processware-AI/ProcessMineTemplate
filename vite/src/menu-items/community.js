import { IconNews, IconCoin, IconHeartHandshake, IconConfetti } from '@tabler/icons-react';

const community = {
  id: 'community-group',
  title: '커뮤니티',
  type: 'group',
  children: [
    {
      id: 'board',
      title: '게시판',
      type: 'item',
      url: '/board',
      icon: IconNews,
      breadcrumbs: true
    },
    {
      id: 'finance',
      title: '회비 관리',
      type: 'item',
      url: '/finance',
      icon: IconCoin,
      breadcrumbs: true
    },
    {
      id: 'clubs',
      title: '동호회 관리',
      type: 'item',
      url: '/clubs',
      icon: IconHeartHandshake,
      breadcrumbs: true
    },
    {
      id: 'events',
      title: '행사 관리',
      type: 'item',
      url: '/events',
      icon: IconConfetti,
      breadcrumbs: true
    }
  ]
};

export default community;
