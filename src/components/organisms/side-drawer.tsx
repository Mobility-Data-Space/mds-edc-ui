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
    <div>
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
      <List>
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
