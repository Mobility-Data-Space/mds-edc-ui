import * as React from 'react';
import { PropsWithChildren, ReactNode } from "react";
import Link from "next/link";
import { useRouter } from 'next/router';
import Image from 'next/image'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {Icon} from "@mui/material";
import MenuIcon from '@mui/icons-material/MenuSharp';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {SvgIconProps} from "@mui/material";
import {useTranslator} from "@/i18n";
import { useSession } from "next-auth/react";
import { useKeycloakLogout } from "../../hooks/use-keycloak-logout";

const drawerWidth = 300;

interface Props extends PropsWithChildren{
  title: ReactNode;
}

type RouteProps = { href: string, title: string, icon: ReactNode, className?: string };

const RouteNode = ({ href, title, icon, className = "" }: RouteProps) => {
  const { translator } = useTranslator();

  return (
    <ListItem key={href} disablePadding classes={{ root: `min-h-14 ${className}` }} >
      <ListItemButton>
        <Link href={href} className="flex flex-row items-center w-full pl-1 gap-x-5" >
          <ListItemIcon className="!min-w-6">
            <Icon className="size-7" color="secondary">
              {icon}
            </Icon>
          </ListItemIcon>
          <ListItemText primary={translator(title)} classes={{ primary: "!font-medium" }} />
        </Link>
      </ListItemButton>
    </ListItem>
  );
}

const iconsProps: SvgIconProps = { className: "size-7", color: "secondary" };

// Logout component
const LogoutSection = () => {
  const { data: session } = useSession();
  const { translator } = useTranslator();
  const logout = useKeycloakLogout();

  const handleLogout = async () => {
    console.log('🚪 Starting complete logout from side drawer...');
    await logout();
  };

  if (!session) return null;

  return (
    <div className="mt-auto border-t border-gray-200">
      {/* User Info */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {session.user?.name?.[0]?.toUpperCase() || session.user?.email?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {session.user?.name || 'User'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {session.user?.email || 'Authenticated'}
            </p>
          </div>
        </div>
      </div>
      
      {/* Logout Button */}
      <ListItem disablePadding>
        <ListItemButton onClick={handleLogout} className="!py-3">
          <ListItemIcon className="!min-w-6">
            <Icon className="size-7 !text-red-600">
              logout
            </Icon>
          </ListItemIcon>
          <ListItemText 
            primary={translator("Sign Out")} 
            classes={{ primary: "!font-medium !text-red-600" }} 
          />
        </ListItemButton>
      </ListItem>
    </div>
  );
};
const routes: ReactNode[] = [
  <RouteNode
    key="dashboard"
    href="/dashboard"
    title="Dashboard"
    icon="data_usage"
  />,
  <RouteNode
    key="catalog"
    href="/catalog-browser"
    title="Catalog Browser"
    icon="sim_card"
  />,
  <RouteNode
    key="contract-agreements"
    href="/contract-agreements"
    title="Contract Agreements"
    icon="assignment_turned_in"
  />,

  <RouteNode
    key="transfer-processes"
    href="/transfer-processes"
    title="Transfer Processes"
    icon="assignment"
  />,
  // TODO: translate
  <h3 key="devider-1" className="mt-8 mx-5 mb-3 text-xs font-semibold text-gray-500 uppercase" >
    Provide
  </h3>,
  <RouteNode
    key="create-offer"
    href="/create-data-offer"
    title="Create Data Offer"
    icon="post_add"
  />,
  <RouteNode
    key="assets"
    href="/assets"
    title="Assets"
    icon="upload"
  />,
  <RouteNode
    key="policy-definitions"
    href="/policy-definitions"
    title="Policies"
    icon="policy"
  />,
  <RouteNode
    key="data-offers"
    href="/data-offers"
    title="Data offers"
    icon="rule"
  />,
  <RouteNode
    key="contract-negotiations"
    href="/contract-negotiations"
    title="Contract negotiations"
    icon="receipt"
  />,
  <RouteNode
    key="negotiation-manual-approval"
    href="/negotiation-manual-approval"
    title="Manual Approvals"
    icon="receipt"
  />,
];

export default function SideDrawer(props: Props) {
  const { title, children } = props;
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };
  const currentHref = router.route;
  const drawer = (
    <div className="h-full flex flex-col">
      <Toolbar >
        <Image
          src="/mds_logo.svg"
          alt="Logo"
          height={0}
          width={0}
          className="m-2"
          fetchPriority="high"
          style={{ height: "57px", width: "70%" }}
        />
      </Toolbar>
      
      {/* Main Navigation */}
      <List className="flex-1">
        {routes.map((route: any) => {
          if (!route || !route.props || route.props.href !== currentHref) {
            return route;
          }
          return {
            ...route,
            props: {
              ...route.props,
              className: "bg-active hover:bg-white",
            }
          };
        })}
      </List>
      
      {/* Logout Section at Bottom */}
      <LogoutSection />
    </div>
  );


  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        elevation={0}
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar className="h-[64px] !pl-4">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' }, }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className="font-bold" noWrap component="div" >
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          slotProps={{
            root: {
              keepMounted: true,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { md: `calc(100% - ${drawerWidth}px)` }, }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
