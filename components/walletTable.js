import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { listToken } from '../api';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function createData(logo, assets, symbol, price, balance, value) {
  return { logo, assets, symbol, price, balance, value };
}

// const rows = [
//   createData('Ethereum', 'ETH', 1426.07, 1.002, 1428.07),
//   createData('Polkadot', 'DOT', 1426.07, 1.002, 1428.07),
//   createData('Chainlink', 'LINK', 1426.07, 1.002, 1428.07),
//   createData('Binance Coin', 'BNB', 1426.07, 1.002, 1428.07),
//   createData('Uniswap', 'UNI', 1426.07, 1.002, 1428.07),
// ];

export default function BasicTable(props) {
  const classes = useStyles();

  const [tokens, setTokens] = React.useState([]);

  React.useEffect(() => {

    (async () => {
      if (props.listtoken.length != 0) {
        const rows = (props.listtoken.data.user.balances).map(t => { return createData(t.logoURI, t.name, t.symbol, t.price || '-', t.value, t.price * t.value) });
        setTokens(rows);
      }
    })();
    
  }, [props]);

  function numberWithCommasAnd2Decimal(x, y = 2) {
    x = parseFloat(x);
    x = x.toFixed(2);
    return x.toLocaleString();
  }

  return (
    <TableContainer component={Paper} className="non-shadow">
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left">Assets</TableCell>
            <TableCell align="left">Symbol</TableCell>
            <TableCell align="left">Price</TableCell>
            <TableCell align="left">Balance</TableCell>
            <TableCell align="left">Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tokens.map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row" align="left">
                <div style={{ display: 'inline-flex', alignItems: 'center' }}>  
                  <img style={{ width: '25px' }} src={row.logo ? row.logo : '/logo/Token.png'} />
                  <div style={{ marginLeft: '6px' }}>{row.assets}</div>
                </div>
              </TableCell>
              <TableCell align="left">{row.symbol}</TableCell>
              <TableCell align="left">${row.price}</TableCell>
              <TableCell align="left">{row.balance}</TableCell>
              <TableCell align="left">${numberWithCommasAnd2Decimal(parseFloat(row.value).toFixed(4))}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
