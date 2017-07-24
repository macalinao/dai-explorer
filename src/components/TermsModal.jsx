import React, { Component } from 'react';
import ReactModal from 'react-modal';
import ReactDOM from 'react-dom';
import AnnouncementText from './AnnouncementText';
import TermsText from './TermsText';

class TermsModal extends Component {
  constructor() {
    super();
    this.state = {
      gotScrollBottom: false
    }
  }

  acceptTerms = (e) => {
    e.preventDefault();
    const type = this.type !== 'undefined' && this.type && typeof this.type.value !== 'undefined' ? this.type.value : false;

    this.props.markAsAccepted(type);
    this.refs.termsContent.scrollTop = 0;
    let gotScrollBottom = {...this.state.gotScrollBottom};
    gotScrollBottom = false;
    this.setState({ gotScrollBottom });

    return false;
  }

  componentDidMount = () => {
    window.requestAnimationFrame(() => {
      if (ReactDOM.findDOMNode(this.refs.termsContent)) {
        this.checkBottom();
        ReactDOM.findDOMNode(this.refs.termsContent).addEventListener('scroll', this.checkBottom);
      }
    });
  };

  checkBottom = () => {
    if (typeof this.refs.termsContent !== 'undefined') {
      const termsContent = this.refs.termsContent;
      if (termsContent.clientHeight + termsContent.scrollTop >= termsContent.scrollHeight) {
        let gotScrollBottom = {...this.state.gotScrollBottom};
        gotScrollBottom = true;
        this.setState({ gotScrollBottom });
      }
    }
  }

  render() {
    const style = {
      overlay: {
        backgroundColor : 'rgba(0, 0, 0, 0.5)'
      },
      content: {
        border: 1,
        borderStyle: 'solid',
        borderRadius: '4px',
        borderColor: '#d2d6de',
        bottom: 'auto',
        height: '80%',  // set height
        left: '50%',
        padding: '2rem',
        position: 'fixed',
        right: 'auto',
        top: '50%', // start from center
        transform: 'translate(-50%,-50%)', // adjust top "up" based on height
        width: '70%',
        maxWidth: '800px',
        overflow: 'hidden'
      }
    };

    return (
      <ReactModal
          isOpen={ this.props.modal.announcement || this.props.modal.terms }
          contentLabel="Action Modal"
          style={ style } >
        <div id="termsWrapper">
          <h2>{ this.props.modal.announcement ? 'Mecon Sai public alpha test announcement' : 'Disclaimer; liabilities and warranties' }</h2>
          <div className="content" ref="termsContent">
            { this.props.modal.announcement ? <AnnouncementText /> : <TermsText /> }
          </div>
          <form ref={(input) => this.termsForm = input} onSubmit={(e) => this.acceptTerms(e)}>
            <input ref={(input) => this.type = input} type="hidden" value={ this.props.modal.announcement ? 'announcement' : 'terms' } />
            <input type="submit" value="Accept" disabled={ !this.state.gotScrollBottom } />
          </form>
        </div>
      </ReactModal>
    )
  }
}

export default TermsModal;
