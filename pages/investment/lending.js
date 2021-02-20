import React from 'react';
import '../../styles/_main.scss';
import AppBar from '../../components/appBar';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import WalletTable from '../../components/walletTable';
import CompareTable from '../../components/compareTable';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

export default function Dashboard() {

  const [doughnutChart, setDoughnutChart] = React.useState();

  

  // React.useEffect(() => {
    
  //   (async () => {

  //   })();

  // }, []);


  return (
    <div id="index">
      <AppBar />
      <Grid container spacing={3}>
        <Grid item xs={12} sm={2} />
        <Grid item xs={12} sm={8}>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={12}>
              <div>
                <div className="header-text">Lending Suggestion</div>
              </div>
              <Paper className="paper">
                <CompareTable></CompareTable>
              </Paper>
            </Grid>
          </Grid>
          
        </Grid>
      </Grid>
    </div>
  );
}
