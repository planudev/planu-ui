import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import FilledInput from '@material-ui/core/FilledInput';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    margin: theme.spacing(1),
  },
  withoutLabel: {
    marginTop: theme.spacing(3),
  },
  textField: {
    width: '25ch',
  },
}));

export default function InputAdornments(props) {
  const classes = useStyles();
  const [values, setValues] = React.useState(0);

  const handleMax = () => {
    setValues(props.max);
    props.onGetAmount(props.max);
  };

  const handleAmountChange = (e) => {
    console.log('e.target.value', e.target.value)
    props.onGetAmount(e.target.value);
    // setValues(e.target.value);
  }

  return (
    <div className={classes.root}>
        <TextField
          onChange={handleAmountChange}
          id="standard-start-adornment"
          className={clsx(classes.margin, classes.textField) + ' eiei'}
          InputProps={{
            // endAdornment: <InputAdornment position="start">Kg</InputAdornment>,
            endAdornment: <div onClick={handleMax}>MAX</div>
          }}
          // value={values}
          // style={{ textAlign: 'right', marginRight: '10px' }}
        />
    </div>
  );
}