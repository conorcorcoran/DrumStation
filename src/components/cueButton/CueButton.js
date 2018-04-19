import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faCue from '@fortawesome/fontawesome-free-solid/faStepBackward'


class CueButton extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            cue: false
        }
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(){
        this.setState({cue: !this.props.cue}, () => {
            this.props.onCueClicked(!this.props.cue);
        });
    }

    render() {
        return (
          <FontAwesomeIcon size="7x" border onClick={() => {this.handleClick()}} icon={faCue} />
        );
    }
}

  export default CueButton;
