import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function createData(assets, symbol, balance, value, collateral, apy, logoURI) {
  return { assets, symbol, balance, value, collateral, apy, logoURI };
}

// const rows = [
//   createData('Ethereum', 'ETH', 0, 0, 0, true),
// ];

export default function BasicTable(props) {
  const classes = useStyles();

  const [rows, setRows] = React.useState([]);

  React.useEffect(() => {

    setRows(props.data.map(i => 
      createData(
        i.underlyingName, 
        i.underlyingSymbol, 
        parseFloat(props.type === 'lending' ? i.suppliedAmount : i.borrowedAmount).toFixed(4),
        (parseFloat(props.type === 'lending' ? i.suppliedAmount : i.borrowedAmount) * i.price).toFixed(4), 
        i.isCollateral ? 'Yes' : 'No', 
        parseFloat(props.type === 'lending' ? i.supplyApy : i.borrowApy).toFixed(2),
        i.logoURI
      )
    ));


    // console.log('props.data', props.data);
    
  }, [props.data]);

  function numberWithCommasAnd2Decimal(x, y = 2) {
    x = parseFloat(x).toFixed(y)
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return (
    <TableContainer component={Paper} className="non-shadow">
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left">{props.type === 'lending' ? 'Supplied' : 'Borrowed'}</TableCell>
            <TableCell align="left">Symbol</TableCell>
            <TableCell align="left">Balance</TableCell>
            <TableCell align="left">Value</TableCell>
            <TableCell align="left">Collateral</TableCell>
            <TableCell align="left" className={props.type === 'lending' ? 'green-text' : 'red-text'}>APY</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                <div style={{ display: 'inline-flex', alignItems: 'center' }}>  
                  <img style={{ width: '25px' }} src={row.logoURI ? row.logoURI : '/logo/Token.png'} />
                  <div style={{ marginLeft: '6px' }}>{row.assets}</div>
                </div>
              </TableCell>
              <TableCell align="left">{row.symbol}</TableCell>
              <TableCell align="left">{numberWithCommasAnd2Decimal(row.balance)}</TableCell>
              <TableCell align="left">${numberWithCommasAnd2Decimal(row.value)}</TableCell>
              <TableCell align="left">{row.collateral}</TableCell>
              <TableCell align="left" className={props.type === 'lending' ? 'green-text' : 'red-text'}>{row.apy}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
