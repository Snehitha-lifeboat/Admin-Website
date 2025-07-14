// assets
import NavigationOutlinedIcon from '@mui/icons-material/NavigationOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined';
import ContactSupportOutlinedIcon from '@mui/icons-material/ContactSupportOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import PeopleAltOutlined from "@mui/icons-material/PeopleAltOutlined";
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import MenuBookOutlined from '@mui/icons-material/MenuBookOutlined';
import ArticleOutlined from '@mui/icons-material/ArticleOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined'; 
import Diversity3OutlinedIcon from '@mui/icons-material/Diversity3Outlined';


const icons = {
  NavigationOutlinedIcon: NavigationOutlinedIcon,
  HomeOutlinedIcon: HomeOutlinedIcon,
LeadsIcon: PeopleAltOutlined,
CoursesIcon: MenuBookOutlined,
  HelpOutlineOutlinedIcon: HelpOutlineOutlinedIcon,
  SecurityOutlinedIcon: SecurityOutlinedIcon,
  AccountTreeOutlinedIcon: AccountTreeOutlinedIcon,
  BlockOutlinedIcon: BlockOutlinedIcon,
  AppsOutlinedIcon: AppsOutlinedIcon,
  ContactSupportOutlinedIcon: ContactSupportOutlinedIcon,
  NewsIcon: ArticleOutlined,
  GroupsIcon:GroupOutlinedIcon,
 PaidOutlinedIcon:PaidOutlinedIcon,
 Diversity3OutlinedIcon:Diversity3OutlinedIcon

};

// ==============================|| MENU ITEMS ||============================== //

// eslint-disable-next-line
export default {
  items: [
    {
      id: 'navigation',
      title: 'Materially',
      caption: 'Dashboard',
      type: 'group',
      icon: icons['NavigationOutlinedIcon'],
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: icons['HomeOutlinedIcon'],
          url: '/dashboard/default'
        }
      ]
    },
    {
      id: 'pages',
      title: 'Pages',
      caption: 'Prebuild Pages',
      type: 'group',
      icon: icons['NavigationOutlinedIcon'],
      children: [
        {
          id: 'sample-page',
          title: 'Leads',
          type: 'item',
          url: '/sample-page',
          icon:  icons['LeadsIcon']
        },
         {
          id: 'courses',
          title: 'Courses',
          type: 'item',
          url: '/Courses/coursesPage',
            icon: icons['CoursesIcon']
        },
        {
          id: 'news',
          title: 'News',
          type: 'item',
          url: '/News/newsPage',
           icon: icons['NewsIcon']

        },
        {
          id: 'users',
          title: 'Users',
          type: 'item',
          url: '/Users/usersPage',
           icon: icons['GroupsIcon']

        },
         {
          id: 'revenu',
          title: 'Revenu',
          type: 'item',
          url: '/Revenu/revenuPage',
           icon: icons['PaidOutlinedIcon']

        },
        {
          id: 'groups',
          title: 'Groups',
          type: 'item',
          url: '/Groups/groupsPage',
           icon: icons['Diversity3OutlinedIcon']

        },
        {
          id: 'trainers',
          title: 'Trainers',
          type: 'item',
          url: '/Trainers/trainersPage',
           icon: icons['Diversity3OutlinedIcon']

        },

        {
          id: 'auth',
          title: 'Authentication',
          type: 'collapse',
          icon: icons['SecurityOutlinedIcon'],
          children: [
            {
              id: 'login-1',
              title: 'Login',
              type: 'item',
              url: '/application/login',
              target: true
            },
            {
              id: 'register',
              title: 'Register',
              type: 'item',
              url: '/application/register',
              target: true
            }
          ]
        }
      ]
    },
    {
      id: 'utils',
      title: 'Utils',
      type: 'group',
      icon: icons['AccountTreeOutlinedIcon'],
      children: [
        {
          id: 'util-icons',
          title: 'Icons',
          type: 'item',
          url: 'https://mui.com/material-ui/material-icons/',
          icon: icons['AppsOutlinedIcon'],
          external: true,
          target: true
        },
        {
          id: 'util-typography',
          title: 'Typography',
          type: 'item',
          url: '/utils/util-typography',
          icon: icons['FormatColorTextOutlinedIcon']
        }
      ]
    },
    {
      id: 'support',
      title: 'Support',
      type: 'group',
      icon: icons['ContactSupportOutlinedIcon'],
      children: [
        {
          id: 'disabled-menu',
          title: 'Disabled Menu',
          type: 'item',
          url: '#',
          icon: icons['BlockOutlinedIcon'],
          disabled: true
        },
        {
          id: 'documentation',
          title: 'Documentation',
          type: 'item',
          url: 'https://codedthemes.gitbook.io/materially-react-material-documentation/',
          icon: icons['HelpOutlineOutlinedIcon'],
          external: true,
          target: true
        }
      ]
    }
  ]
};
