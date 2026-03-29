import { IconBuildingCommunity, IconHierarchy, IconTie, IconUsersGroup, IconBriefcase } from '@tabler/icons-react';

const organization = {
  id: 'organization-group',
  title: '조직',
  type: 'group',
  children: [
    {
      id: 'organization',
      title: '조직 관리',
      type: 'collapse',
      icon: IconBuildingCommunity,
      children: [
        {
          id: 'org-chart',
          title: '조직도',
          type: 'item',
          url: '/organization',
          icon: IconHierarchy,
          breadcrumbs: true
        },
        {
          id: 'executives',
          title: '임원진',
          type: 'item',
          url: '/organization/executives',
          icon: IconTie,
          breadcrumbs: true
        },
        {
          id: 'committee',
          title: '운영위원회',
          type: 'item',
          url: '/organization/committee',
          icon: IconUsersGroup,
          breadcrumbs: true
        },
        {
          id: 'executive-board',
          title: '집행부',
          type: 'item',
          url: '/organization/executive-board',
          icon: IconBriefcase,
          breadcrumbs: true
        }
      ]
    }
  ]
};

export default organization;
