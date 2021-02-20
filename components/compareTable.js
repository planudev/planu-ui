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
import { lending } from '../api';
import CircularProgress from '@material-ui/core/CircularProgress';

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});

function createData(coin, calories, fat, carbs, protein, price, logoURI) {
  return {
    coin,
    calories,
    fat,
    carbs,
    protein,
    price,
    logoURI
  };
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        
        <TableCell component="th" scope="row" align="left">
          <div style={{ display: 'inline-flex' }}>
            <img src={row.price || '/logo/Token.png'} style={{width:'25px'}} />
            <div>&nbsp;&nbsp;{row.coin}</div>
          </div>
          {/* {row.coin} */}
        </TableCell>
        {console.log(row.protein, row.calories)}
        <TableCell align="center" className={row.protein == row.calories ? 'highest-apy' : ''}>{row.calories === '-' ? '-' : row.calories + '%'}</TableCell>
        <TableCell align="center" className={row.protein == row.fat ? 'highest-apy' : ''}>{row.fat === '-' ? '-' : row.fat + '%'}</TableCell>
        <TableCell align="center" className={row.protein == row.carbs ? 'highest-apy' : ''}>{row.carbs === '-' ? '-' : row.carbs + '%'}</TableCell>
        {/* <TableCell align="center">{row.protein}</TableCell> */}
        {/* <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell> */}
      </TableRow>
      {/* <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <h3>Recommand ...</h3>
              <table>
                <tr>
                  <td>Scoring</td>
                  <td>93/100</td>
                </tr>
                <tr>
                  <td>Highest interest at</td>
                  <td>5.5%</td>
                </tr>
                <tr>
                  <td>Fee at</td>
                  <td>0.83%</td>
                </tr>
              </table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow> */}
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



const colsPool = [
  { name: 'Venus', logo: 'Venus.png' },
  { name: 'ForTube', logo: 'ForTube.png' },
  { name: 'C.R.E.A.M', logo: 'Cream.png' },
];

export default function CollapsibleTable() {

  const [tokens, setTokens] = React.useState([]);
  const [rows, setRows] = React.useState([]);

  const [isWaiting, setIsWaiting] = React.useState(false);

  React.useEffect(() => {

    (async () => {
      setIsWaiting(true);
      const token = await lending();
      console.log('token', token)

      setRows(token.map(t => (
        createData(t.token, t.venus.supplyApyToFixed || '-', t.fortube.supplyApyToFixed || '-', t.cream.supplyApyToFixed || '-', t.max, t.logoURI)
      )));

      setIsWaiting(false);

    })();
    
  }, []);

  return (
    <TableContainer component={Paper} className="non-shadow">
      { !isWaiting ? 
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell align="left">Coin</TableCell>

            {colsPool.map((data) => (
              <TableCell align="center">
                <div style={{ display: 'inline-flex' }}>
                  <img src={'/logo/' + data.logo} style={{width:'25px'}} />
                  <div>&nbsp;{data.name}</div>
                </div>
              </TableCell>
            ))}
            <TableCell />
            <TableCell />

          </TableRow>
        </TableHead>

          <TableBody>
            {rows.map((row) => (
              <Row key={row.name} row={row} />
            ))}
          </TableBody>
          
      </Table> : 
        <div style={{ width: '100%', textAlign: 'center' }}>
          <CircularProgress /> 
        </div>
      }
    </TableContainer>
  );
}

