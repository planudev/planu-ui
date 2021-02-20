import React from 'react';
import '../styles/_main.scss';
import AppBar from '../components/appBar';
import Paper from '@material-ui/core/Paper';


export default function PaperWithLogo(props) {

  const [logoIcon, setLogoIcon] = React.useState('');
  const [classColor, setClassColor] = React.useState('');

  React.useEffect(() => {
    switch(props.logo) {
      case 'equal':
        setLogoIcon('equal.png')
        setClassColor('paper-blue')
        break;
      case 'plus':
        setLogoIcon('plus.png')
        setClassColor('paper-green')
        break;
      case 'minus':
        setLogoIcon('minus.png')
        setClassColor('paper-red')
        break;
    }
  }, []);

  return (
    <div className="paper-with-logo">
      <Paper className={'paper paper-hilight ' + classColor}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <div className="paper-header">{props.first.title}</div>
            <div className="paper-header-number">${props.first.value}​​</div>
          </div>
          <div style={{ marginLeft: '10px' }}>
            <img src={'/' + logoIcon} style={{ width: '40px' }} />
          </div>
        </div>

        {props.second ? 
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <div className={props.second.size === 's' ? 'sub-title-header' : 'paper-header'}>{props.second.title}</div>
            <div className={props.second.size === 's' ? 'sub-title-value' : 'paper-header-number'}>${props.second.value}​​</div>
          </div>
        </div> : '' }
      </Paper>
    </div>
  );
}
