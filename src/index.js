import React, { Component } from 'react'
import { formStore } from './store/formGenerator'
import Container from './components/container'

class Form extends Component {
    render() {
        const { form } = this.props;
        const newForm = formStore.create(form);
        return (
            <div>
                <Container formStore={newForm} form={form} />
            </div>
        )
    }
}

export default Form;