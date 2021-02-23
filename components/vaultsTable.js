import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import TextField from '@material-ui/core/TextField';
import MaxButton from './maxButton';
import { depositVaults, withdrawVaults, approveBUSD, balanceOfpBUSD, balanceOfBUSD, getPricePerFullShare } from '../api/smartContract';

function numberWithCommasAnd2Decimal(x, y = 2) {
  x = parseFloat(x);
  x = x.toFixed(2);
  return x.toLocaleString();
}  

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});

function createData(name, calories, fat, carbs, protein, price, tvl) {
  return {
    name,
    calories,
    fat,
    carbs,
    protein,
    price,
    tvl,
    history: [
      { date: '2020-01-05', customerId: '11091700', amount: 3 },
      { date: '2020-01-02', customerId: 'Anonymous', amount: 1 },
    ],
  };
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(true);
  const classes = useRowStyles();

  const [mode, setMode] = React.useState(true);

  const [isWithdrawalConfirm, setIsWithdrawalConfirm] = React.useState(false);


  const [depositAmount, setDepositAmount] = React.useState(0);

  const handleDepositAmount = (e) => {
    setDepositAmount(e);
  };

  const handleSubmitDeposit = () => {
    approveBUSD();
    // increaseAllowanceBUSD();
    depositVaults(depositAmount)
  };

  const DepositElement = () => {
    return (
      <div className="vaults-detail">
        <div className="switch">
          <ButtonGroup size="large" color="primary" aria-label="large outlined primary button group">
            <Button variant="contained" color="primary" className="deposit-button-selected">Deposit</Button>
            <Button className="" onClick={handleSwitchMode} className="withdrawal-button">Withdrawal</Button>
          </ButtonGroup>
        </div>
        <table className="info">
          <tr>
            <td style={{ width: '40%' }}>Balance:</td>
            <td className="number">{balanceOfBUSDMe}</td>
            <td>BUSD</td>
          </tr>
          <tr>
            <td>I would like to deposit</td>
            <td>
              {/* <MaxButton max="3.3491" onGetAmount={handleDepositAmount} /> */}
              <TextField
                onChange={e => setDepositAmount(e.target.value)}
                id="standard-start-adornment"
                value={depositAmount}
                type="number"
              />
            </td>
            <td>BUSD</td>
          </tr>
          <tr>
            <td colspan="2" className="red-text">* Please be noted that there is withdrawal fee at 0.25 % ​</td>
          </tr>
        </table>
        <div className="switch">
          <Button variant="contained" color="primary" className="deposit-button-selected" onClick={handleSubmitDeposit}>
            Deposit
          </Button>
        </div>
      </div>
    )
  }

  const handleToWithdrawalConfirm = () => {
    setIsWithdrawalConfirm(!isWithdrawalConfirm)
  };

  const [withdrawAmount, setWithdrawAmount] = React.useState(0);

  const handleSubmitWithdraw = () => {
    withdrawVaults(withdrawAmount)
  };

  const [balanceOfMe, setBalanceOfMe] = React.useState(0);
  const [balanceOfBUSDMe, setBalanceOfBUSDMe] = React.useState(0);
  const [pricePerFullShare, setPricePerFullShare] = React.useState(0);

  React.useEffect(() => {
    (async () => {
      const balanceOfMee = await balanceOfpBUSD();
      setBalanceOfMe(balanceOfMee);
      setBalanceOfBUSDMe(await balanceOfBUSD());
      setPricePerFullShare(await getPricePerFullShare());
    })();

  }, []);
  

  const WithdrawalElement = () => {
    return (
      <div className="vaults-detail">
        <div className="switch">
          <ButtonGroup size="large" color="primary" aria-label="large outlined primary button group">
            <Button className="" onClick={handleSwitchMode} className="deposit-button">Deposit</Button>
            <Button variant="contained" color="primary" className="withdrawal-button-selected">Withdrawal</Button>
          </ButtonGroup>
        </div>
        {!isWithdrawalConfirm ? 
          <div>
            <table className="info">
              <tr>
                <td style={{ width: '40%' }}>pBUSD Balance:</td>
                <td className="number">{balanceOfMe}</td>
                <td>pBUSD</td>
              </tr>
              <tr>
                <td>Earn:</td>
                <td className="number">{balanceOfMe * pricePerFullShare}</td>
                <td>pBUSD</td>
              </tr>
              <tr>
                <td>I would like to redeem</td>
                <td>
                  {/* <MaxButton max="3.3491" className="input-field"/> */}
                  <TextField
                    onChange={e => setWithdrawAmount(e.target.value)}
                    id="standard-start-adornment"
                    value={withdrawAmount}
                    type="number"
                  />
                </td>
                <td>pBUSD</td>
              </tr>
              <tr>
                <td colspan="2" className="red-text">* 0.25 % withdrawal fee will be applied​​</td>
              </tr>
            </table>
            <div className="switch">
              <Button variant="contained" color="primary" className="withdrawal-button-selected" onClick={handleToWithdrawalConfirm}>
                Next
              </Button>
            </div>
          </div> 
          : 
          <div>
          <table className="info">
            <tr>
              <td style={{ width: '40%' }}>Withdraw:</td>
              <td className="number">{withdrawAmount * pricePerFullShare}</td>
              <td>BUSD</td>
            </tr>
            <tr>
              <td>0.25% withdrawal fee:</td>
              <td className="number">{(withdrawAmount * 0.25) / 100}</td>
              <td>BUSD</td>
            </tr>
            <tr>
              <td>Total earnings</td>
              <td className="number">{withdrawAmount - ((withdrawAmount * 0.25) / 100)}</td>
              <td>BUSD</td>
            </tr>
          </table>
          <div className="switch">
            <Button variant="contained" color="primary" className="withdrawal-button-selected" onClick={handleSubmitWithdraw}>
              Withdraw
            </Button>
          </div>
        </div>
        }
      </div>
    )
  };

  const handleSwitchMode = () => {
    setMode(!mode)
    setIsWithdrawalConfirm(false);
  };

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" align="left">
          {row.name}
        </TableCell>
        <TableCell align="left">{row.calories}</TableCell>
        <TableCell align="left">{row.fat}</TableCell>
        <TableCell align="left">{row.carbs}</TableCell>
        <TableCell align="left">{row.protein}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              { mode ? <DepositElement /> : <WithdrawalElement /> }
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    calories: PropTypes.number.isRequired,
    carbs: PropTypes.number.isRequired,
    fat: PropTypes.number.isRequired,
    history: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number.isRequired,
        customerId: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
      }),
    ).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    protein: PropTypes.number.isRequired,
  }).isRequired,
};



export default function CollapsibleTable() {

  const [balanceOfMe, setBalanceOfMe] = React.useState(0);
  const [balanceOfBUSDMe, setBalanceOfBUSDMe] = React.useState(0);
  const [pricePerFullShare, setPricePerFullShare] = React.useState(0);

  const [rows, setRows] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      const balanceOfMee = await balanceOfpBUSD();
      setBalanceOfMe(balanceOfMee);
      setBalanceOfBUSDMe(await balanceOfBUSD());
      setPricePerFullShare(await getPricePerFullShare());
      console.log('balanceOfMe', balanceOfMe, (pricePerFullShare))

      setRows([createData('pBUSD', balanceOfMe, (balanceOfMe * pricePerFullShare), '152%', '0.8%', 8.94),])
  
    })();

  }, [balanceOfMe, pricePerFullShare]);

  

  return (
    <TableContainer component={Paper} className="non-shadow">
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell align="left">Token</TableCell>
            <TableCell align="left">Balance</TableCell>
            <TableCell align="left">Deposited​</TableCell>
            <TableCell align="left">APY</TableCell>
            <TableCell align="left">Daily</TableCell>
            {/* <TableCell align="left">TVL</TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row key={row.name} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}