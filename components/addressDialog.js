import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Cookies from 'js-cookie';

export default function AlertDialog() {
  const [open, setOpen] = React.useState(false);

  const [address, setAddress] = React.useState('');

  React.useEffect(() => {

    if (!Cookies.get('address')) {
      setOpen(true);
    } else {
      setAddress(Cookies.get('address'));
    }

    (async () => {
      if (window.ethereum) {
      //   try {
      //     // Popup Metamask for request permission
      //     const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      //     setAccounts(accounts[0]);
      //     Cookies.set('address', accounts[0]);
      //   } catch (err) {
      //     console.log(err)
      //   }

        ethereum.on('accountsChanged', async (accounts) => {
          setAddress(accounts)
          // setIsWaitingAccountChange(true);
          // await new Promise(resolve => setTimeout(resolve, 1000));
          // setIsWaitingAccountChange(false);
          window.location.reload(false);
        });
      }
    })();

  }, []);


  const handleClickOpen = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handleSubmit = () => {
    Cookies.set('address', address);
    setOpen(false);
    window.location.reload(false);
  };

  const handleConnectMetamask = () => {
    (async () => {
      if (window.ethereum) {
        try {
          // Popup Metamask for request permission
          const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
          Cookies.set('address', accounts[0]);
        } catch (err) {
          console.log(err)
        }
      }
    })();
    setOpen(false);
    
  };

  return (
    <div>
      {/* <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Open alert dialog
      </Button> */}
      <Button color="inherit" onClick={handleClickOpen}>{Cookies.get('address') || ''}</Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="dialog-address"
      >
        <DialogTitle id="alert-dialog-title">{"Enter Wallet Address"}</DialogTitle>
        <DialogContent>
          <div style={{width:'600px'}}></div>
          {/* <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means sending anonymous location data to
            Google, even when no apps are running.
          </DialogContentText> */}
          <DialogContentText id="alert-dialog-description">
            <TextField id="outlined-basic" label="Address" variant="outlined" fullWidth onChange={handleAddressChange} />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConnectMetamask} color="primary">
            Connect Metamask
          </Button>
          <Button onClick={handleSubmit} color="primary" autoFocus>
            Enter
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}