import React from 'react'
import {Card} from 'antd-mobile'
import {soulContext} from 'soul'

class RegAgreementView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      termsHtml: ''
    }
    this.$service = this.props.$service
  }

  componentDidMount() {
    this.$service.origin().terms.get()
      .then(res => {
        this.setState({
          termsHtml: _.get(res.data, 'value') || _.get(res.data, 'defaultValue')
        })
      })
  }

  render() {
    return (
      <div className="register-page-agreement">
        <Card className="full-card">
          <Card.Body>
            <div dangerouslySetInnerHTML={{__html: this.state.termsHtml}}/>
          </Card.Body>
        </Card>
      </div>
    )
  }
}

export default soulContext()(RegAgreementView)
