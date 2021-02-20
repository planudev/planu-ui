import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import AddressDialog from './addressDialog';
import Link from 'next/link'
import { useRouter } from 'next/router'
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Cookies from 'js-cookie';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function AppBarMenu() {
  const router = useRouter();
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [accounts, setAccounts] = React.useState(false);
  const [isWaitingAccountChange, setIsWaitingAccountChange] = React.useState(false);

  // React.useEffect(() => {

  //   (async () => {
  //     if (window.ethereum) {
  //       try {
  //         // Popup Metamask for request permission
  //         const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
  //         setAccounts(accounts[0]);
  //         Cookies.set('address', accounts[0]);
  //       } catch (err) {
  //         console.log(err)
  //       }

  //       ethereum.on('accountsChanged', async (accounts) => {
  //         setAccounts(accounts)
  //         setIsWaitingAccountChange(true);
  //         await new Promise(resolve => setTimeout(resolve, 1000));
  //         setIsWaitingAccountChange(false);
  //       });
  //     }
  //   })();
    
  // }, []);

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Backdrop className={classes.backdrop} open={isWaitingAccountChange}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            {/* PLANU */}
            <img style={{ width: '140px' }} src="/PlanU4.png"></img>
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            <Link href="/"><Button color="inherit" style={{textTransform: 'none'}} className={router.pathname === '/' ? 'selected-menu' : '' }>Dashboard</Button></Link>
            <Link href="/portfolio"><Button color="inherit" style={{textTransform: 'none'}} className={router.pathname === '/portfolio' ? 'selected-menu' : '' }>Portfolio</Button></Link>
            <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} color="inherit" style={{textTransform: 'none'}} className={router.pathname.includes('/investment') ? 'selected-menu' : '' }>Investment ▼</Button>
            <Link href="/history"><Button color="inherit" style={{textTransform: 'none'}} className={router.pathname === '/history' ? 'selected-menu' : '' }>History</Button></Link>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <Link href="/investment/lending"><MenuItem onClick={handleClose} className={router.pathname === '/investment/lending' ? 'selected-menu without-underline' : '' }>Lending</MenuItem></Link>
              <Link href="/investment/borrowing"><MenuItem onClick={handleClose}>Borrowing</MenuItem></Link>
              <MenuItem onClick={handleClose}>Liquidity</MenuItem>
              <Link href="/investment/vaults"><MenuItem onClick={handleClose}>Vaults</MenuItem></Link>
            </Menu>
          </Typography>
          <AddressDialog />
          {/* <Button color="inherit">{accounts}</Button> */}
        </Toolbar>
      </AppBar>
    </div>
  );
}