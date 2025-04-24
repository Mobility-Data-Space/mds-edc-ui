import * as React from 'react';
import Image from 'next/image'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {
  Boxes,
  Gauge,
  Handshake,
  ReceiptText,
  Ruler,
  SmartphoneNfc,
  Store,
  Truck,
} from "lucide-react";
import PostAddIcon from '@mui/icons-material/PostAdd';
import { PropsWithChildren, ReactNode } from "react";
import Link from "next/link";
import {useTranslator} from "@/i18n";

const drawerWidth = 300;

interface Props extends PropsWithChildren{
  title: ReactNode;
}

type RouteProps = { href: string, title: string, icon: ReactNode };

const RouteNode = ({ href, title, icon }: RouteProps) => {
  const { translator } = useTranslator();

  return (
    <ListItem key={href} disablePadding >
      <ListItemButton>
        <Link href={href} className="flex flex-row w-full" >
          <ListItemIcon>
            {icon}
          </ListItemIcon>
          <ListItemText primary={translator(title)} />
        </Link>
      </ListItemButton>
    </ListItem>
  );
}

const routes: ReactNode[] = [
  <RouteNode
    key="overview"
    href="/"
    title="Overview"
    icon={<Gauge className="size-6" />}
  />,
  <RouteNode
    key="assets"
    href="/assets"
    title="Assets"
    icon={<Boxes className="size-6" />}
  />,
  <RouteNode
    key="policy-definitions"
    href="/policy-definitions"
    title="Policy definitions"
    icon={<Ruler className="size-6" />}
  />,
  <RouteNode
    key="contract-definitions"
    href="/contract-definitions"
    title="Contract definitions"
    icon={<ReceiptText className="size-6" />}
  />,
  // TODO: translate
  <h3 key="devider-1" className="mt-8 mx-5 mb-3 font-medium text-gray-500" >
    Provide
  </h3>,
  <RouteNode
    key="create-asset"
    href="/create-asset"
    title="Data offer"
    icon={<PostAddIcon className="size-6" />}
  />,
  <RouteNode
    key="/catalog"
    href="/catalog"
    title="Catalog"
    icon={<Store className="size-6" />}
  />,
  <RouteNode
    key="contract-agreements"
    href="/contract-agreements"
    title="Contract agreements"
    icon={<Handshake className="size-6" />}
  />,
  <RouteNode
    key="contract-negotiations"
    href="/contract-negotiations"
    title="Contract negotiations"
    icon={<SmartphoneNfc className="size-6" />}
  />,
  <RouteNode
    key="transfer-processes"
    href="/transfer-processes"
    title="Transfer processes"
    icon={<Truck className="size-6" />}
  />,
];

export default function SideDrawer(props: Props) {
  const { title, children } = props;
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

  const drawer = (
    <div>
      <Toolbar >
        <Image src="/mds_logo.svg" alt="Logo" height="57" width="0" className="my-2" style={{ width: "70%" }} />
      </Toolbar>
      <List>
        {routes}
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
        <Toolbar className="h-[73px]">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' }, }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" >
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
        sx={{ flexGrow: 1, p: 3, width: { md: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
