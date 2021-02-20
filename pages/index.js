import React from 'react';
import '../styles/_main.scss';
import AppBar from '../components/appBar';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Doughnut } from 'react-chartjs-2';
import PaperWithLogo from '../components/paperWithLogo';
import { dashboardSummarry, venus } from '../api';

export default function Dashboard() {

  const [dashboardData, setDashboardData] = React.useState('');
  const [estimateDailyInterestEarned, setEstimateDailyInterestEarned] = React.useState(0);

  React.useEffect(() => {
    
    (async () => {
      setDashboardData(await dashboardSummarry());

      const venusObj = await venus();

      let edie = 0;
      venusObj.data.venus.suppliedTokens.map(i => {
        edie += ((parseFloat(i.suppliedAmount) * parseFloat(i.price)) * parseFloat(i.supplyApy)) / 365;
      });
      setEstimateDailyInterestEarned(edie.toFixed(2));
    })();

  }, []);

  const dataDebt = {
    labels: ['Venus'],
    datasets: [
      {
        label: '# of Votes',
        data: [100],
        backgroundColor: [
          '#F9AD6A',
        ],
        borderColor: [
          '#F9AD6A',
        ],
        borderWidth: 1,
      },
    ],
  }

  const data = {
    labels: ['Assets', 'Pools', 'Compound'],
    datasets: [
      {
        label: '# of Votes',
        data: [20,50,30],
        backgroundColor: [
          '#F9AD6A',
          '#F9E07F',
          '#D46C4E',
        ],
        borderColor: [
          '#F9AD6A',
          '#F9E07F',
          '#D46C4E',
        ],
        borderWidth: 1,
      },
    ],
  }

  function numberWithCommasAnd2Decimal(x) {
    x = parseFloat(x).toFixed(2)
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return (
    <div id="index">
      <AppBar />
      <Grid container spacing={3}>
        <Grid item xs={12} sm={2} />
        <Grid item xs={12} sm={8}>
          <div className="header-text">Your Assets Overview</div>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={12}>
                  <PaperWithLogo first={{ title: 'Net Worth (USD)', value: numberWithCommasAnd2Decimal(dashboardData.netWorth || 0) }} logo="equal" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <PaperWithLogo first={{ title: 'Total Assets ​(USD)', value: numberWithCommasAnd2Decimal((dashboardData.totolAssetUSD) || 0) }} logo="plus" fullWidth={true} />  
                </Grid>
                <Grid item xs={12} sm={6}>
                  <PaperWithLogo first={{ title: 'Total Supplied on Venus (USD)', value: numberWithCommasAnd2Decimal(dashboardData.totalSuppliedVenus || 0) }} second={{ title: 'Estimated Daily Interest ​Earned (USD)', value: numberWithCommasAnd2Decimal(estimateDailyInterestEarned) }} logo="plus" />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper className="paper" style={{padding: '10%'}}>
              {/* <div style={{padding: '10%'}}> */}
              <div style={{ textAlign: 'center', fontSize: '28px', marginBottom: '12px', color: '#4C2981' }}>Portfolio</div>
                  <Doughnut data={{
                              labels: ['Assets', 'Venus'],
                              datasets: [
                                {
                                  label: '# of Votes',
                                  data: dashboardData.percentWorth,
                                  backgroundColor: [
                                    '#F9AD6A',
                                    '#F9E07F',
                                    '#D46C4E',
                                  ],
                                  borderColor: [
                                    '#F9AD6A',
                                    '#F9E07F',
                                    '#D46C4E',
                                  ],
                                  borderWidth: 1,
                                },
                              ],
                            }}
                  width={10}
                  height={10}
                  options={{ cutoutPercentage: 80 }}
                  legend={{ position: 'bottom' }}
                />
              </Paper>
              {/* </div> */}
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} sm={2} />
        <Grid item xs={12} sm={2} />
        <Grid item xs={12} sm={8}>
          <div className="header-text">Your Debts Overview</div>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={12}>
                  <PaperWithLogo first={{ title: 'Total Debts (USD)', value: numberWithCommasAnd2Decimal(dashboardData.totalDebts || 0) }} logo="minus" />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper className="paper" style={{padding: '10%'}}>
              {/* <div style={{padding: '10%'}}> */}
                <Doughnut data={{
                    labels: ['Venus'],
                    datasets: [
                      {
                        label: '# of Votes',
                        data: dashboardData.percentDebts,
                        backgroundColor: [
                          '#F9AD6A',
                        ],
                        borderColor: [
                          '#F9AD6A',
                        ],
                        borderWidth: 1,
                      },
                    ],
                  }}
                  width={10}
                  height={10}
                  options={{ cutoutPercentage: 80 }}
                  legend={{ position: 'bottom' }}
                />
              </Paper>
              {/* </div> */}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
