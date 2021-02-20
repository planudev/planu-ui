import React from 'react';
import '../styles/_main.scss';
import AppBar from '../components/appBar';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import WalletTable from '../components/walletTable';
import VeuseTable from '../components/veuseTable';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { listToken, venus } from '../api';
import PaperWithLogo from '../components/paperWithLogo';

export default function Dashboard() {

  const [doughnutChart, setDoughnutChart] = React.useState();

  const [tokens, setTokens] = React.useState([]);
  const [totalDollar, setTotalDollar] = React.useState('');

  const [venusData, setVenusData] = React.useState();

  const [estimateDailyInterestEarned, setEstimateDailyInterestEarned] = React.useState(0);
  const [estimateDailyInterestAccrued, setEstimateDailyInterestAccrued] = React.useState(0);

  React.useEffect(() => {

    (async () => {
      const listtoken = await listToken();
      setTokens(listtoken);

      const sumOfCoinDollar = (listtoken.data.user.balances).map(t => { return t.price * t.value }).reduce((a, b) => a + b, 0)
      setTotalDollar(sumOfCoinDollar);

      const venusObj = await venus();
      setVenusData(venusObj.data.venus)

      let edia = 0;
      venusObj.data.venus.borrowedTokens.map(i => {
        edia += ((parseFloat(i.borrowedAmount) * parseFloat(i.price)) * parseFloat(i.borrowApy)) / 365;
      });
      setEstimateDailyInterestAccrued(edia.toFixed(2))

      let edie = 0;
      venusObj.data.venus.suppliedTokens.map(i => {
        edie += ((parseFloat(i.suppliedAmount) * parseFloat(i.price)) * parseFloat(i.supplyApy)) / 365;
      });
      setEstimateDailyInterestEarned(edie.toFixed(2));
    })();
    
  }, []);

  function numberWithCommasAnd2Decimal(x, y = 2) {
    x = parseFloat(x).toFixed(y)
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return (
    <div id="index">
      <AppBar />
      <div className="space" />
      <Grid container spacing={3}>
        <Grid item xs={12} sm={2} />
        <Grid item xs={12} sm={8}>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <PaperWithLogo first={{ title: 'Net Worth (USD)', 
                value: numberWithCommasAnd2Decimal(parseFloat((totalDollar ? totalDollar : 0) 
                          - (venusData ? parseFloat(venusData.totalBorrowBalance).toFixed(4) : 0)).toFixed(4) )
                }} logo="equal" />
            </Grid>
            <Grid item xs={12} sm={4}>
              <PaperWithLogo first={{
                title: 'Total Assets ​(USD)',
                value: numberWithCommasAnd2Decimal(parseFloat(totalDollar ? totalDollar : 0).toFixed(4)) }}
                second={{ title: 'Estimated Daily Interest Earned', value: estimateDailyInterestEarned, size: 's' }} logo="plus" />  
            </Grid>
            <Grid item xs={12} sm={4}>
              <PaperWithLogo 
              first={{ title: 'Total Debts ​(USD)', 
              value: venusData ? numberWithCommasAnd2Decimal(parseFloat(venusData.totalBorrowBalance).toFixed(4)) : 0 }} 
              second={{ title: 'Estimated Daily Interest Accrued', value: estimateDailyInterestAccrued, size: 's' }} 
              logo="minus" />  
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={12}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div className="header-text">Wallet</div>
                <div style={{ marginTop: '20px', marginBottom: '12px' }}>Total ${numberWithCommasAnd2Decimal(totalDollar ? totalDollar.toFixed(4) : 0)}</div>
              </div>
              <Paper className="paper">
                <WalletTable listtoken={tokens}></WalletTable>
              </Paper>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={12}>
              <div className="header-text">Venus</div>
              <Paper className="paper">
                <table>
                  <tr>
                    <td>Supplied</td>
                    <td>${venusData ? venusData.totalSupplyBalance : ''}</td>
                  </tr>
                  <tr>
                    <td>Borrowed</td>
                    <td>${venusData ? venusData.totalBorrowBalance : ''}</td>
                  </tr>
                </table>

                <p className="green-text" style={{ fontSize: '18px' }}>Lending</p>
                <VeuseTable type="lending" data={venusData ? venusData.suppliedTokens : []} />

                <div className="space" />
                <div className="space" />
                <div className="space" />
                <div className="space" />

                <p className="red-text" style={{ fontSize: '18px' }}>Borrowing</p>
                <VeuseTable type="borrowing" data={venusData ? venusData.borrowedTokens : []} />

              </Paper>
            </Grid>
          </Grid>
          
        </Grid>
      </Grid>
    </div>
  );
}
