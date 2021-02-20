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
            <td className="number">3.3491</td>
            <td>CAKE-BNB LP</td>
          </tr>
          <tr>
            <td>I would like to deposit</td>
            <td>
              <MaxButton max="3.3491"/>
            </td>
            <td>CAKE-BNB LP</td>
          </tr>
          <tr>
            <td colspan="2" className="red-text">* Please be noted that there is withdrawal fee at 0.25 % ​</td>
          </tr>
        </table>
        <div className="switch">
          <Button variant="contained" color="primary" className="deposit-button-selected">
            Deposit
          </Button>
        </div>
      </div>
    )
  }

  const WithdrawalElement = () => {
    return (
      <div className="vaults-detail">
        <div className="switch">
          <ButtonGroup size="large" color="primary" aria-label="large outlined primary button group">
            <Button className="" onClick={handleSwitchMode} className="deposit-button">Deposit</Button>
            <Button variant="contained" color="primary" className="withdrawal-button-selected">Withdrawal</Button>
          </ButtonGroup>
        </div>
        <table className="info">
          <tr>
            <td style={{ width: '40%' }}>Deposited:</td>
            <td className="number">3.3491</td>
            <td>BUSD</td>
          </tr>
          <tr>
            <td>Share:</td>
            <td className="number">3.3491</td>
            <td>BUSD</td>
          </tr>
          <tr>
            <td>I would like to withdrawal</td>
            <td>
              <MaxButton max="3.3491" className="input-field"/>
            </td>
            <td>BUSD</td>
          </tr>
          <tr>
            <td colspan="2" className="red-text">* 0.25 % withdrawal fee will be applied​​</td>
          </tr>
        </table>
        <div className="switch">
          <Button variant="contained" color="primary" className="withdrawal-button-selected">
            Next
          </Button>
        </div>
      </div>
    )
  };

  const handleSwitchMode = () => {
    setMode(!mode)
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

const rows = [
  createData('CAKE-BNB LP', 3.3491, 1.1326, 152, 0.8, 8.94),
];

export default function CollapsibleTable() {
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