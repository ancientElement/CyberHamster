export interface NavigationItem {
  id: string;
  title: string;
  icon: string;
  url: string;
  description: string;
}

export const NavigationData: NavigationItem[] = [
  {
    id: 'github',
    title: 'GitHub',
    icon: 'https://github.com/favicon.ico',
    url: 'https://github.com',
    description: '代码托管平台'
  },
  {
    id: 'google',
    title: 'Google',
    icon: 'https://www.google.com/favicon.ico',
    url: 'https://google.com',
    description: '搜索引擎'
  },
  {
    id: 'stackoverflow',
    title: 'Stack Overflow',
    icon: 'https://cdn.sstatic.net/Sites/stackoverflow/Img/favicon.ico',
    url: 'https://stackoverflow.com',
    description: '技术问答社区'
  },
  {
    id: 'react',
    title: 'React',
    icon: 'https://reactjs.org/favicon.ico',
    url: 'https://reactjs.org',
    description: 'React官网'
  },
];