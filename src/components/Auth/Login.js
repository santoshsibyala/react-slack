import React from 'react';
import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';


import firebase from '../../firebase';

class Login extends React.Component {
    state = {
        email: '',
        password: '',
        errors: [],
        loading: false
    }
    handleChange = event => {
        let { name, value } = event.target;

        this.setState({ [name]: value})
    }

    displayErrors = errors => errors.map((error, i) => <p key={i}>{error.message}</p>);

    handleSubmit = event => {
        event.preventDefault();
        if(this.isFormValid()) {
            let { email, password, errors} = this.state;
            firebase
                .auth()
                .signInWithEmailAndPassword(email, password)
                .then(signedInUser => {
                    console.log(signedInUser)
                })
                .catch((err) => {
                   console.log(err);
                   this.setState({errors: errors.concat(err), loading: false}) 
                })
            
        }
        
    }

    isFormValid = () => {
        let { email, password} = this.state;
        return email && password;
    }



    handleInputErrors = (errors, inputName) => {
        return errors.some(error => error.message.toLowerCase().includes(inputName)) ? 'error' : '';
    }

    render() {
        let { password, email, errors, loading } = this.state;
        return(
            <Grid textAlign='center' verticalAlign='middle' className="app">
                <Grid.Column style={{maxWidth: 450}}>
                    <Header as="h1" icon color="violet" textAlign="center">
                        <Icon name="code branch" color="violet" />
                        Login to Chat App
                    </Header>
                    <Form size="large" onSubmit={this.handleSubmit}>
                        <Segment stacked>
                            <Form.Input fluid name="email" icon="mail" iconPosition="left" value={email}
                                        placeholder="Email Address" onChange={this.handleChange} type="email" 
                                        className={this.handleInputErrors(errors, 'email')} />

                            <Form.Input fluid name="password" icon="lock" iconPosition="left" value={password}
                                        placeholder="Password" onChange={this.handleChange} type="password" 
                                        className={this.handleInputErrors(errors, 'password')} />

                            

                            <Button disabled={loading} className={loading ? 'loading': ''} color="violet" fluid size="large">Submit</Button>
                        </Segment>
                    </Form>
                    { errors.length > 0 ? (
                        <Message error>
                            <h3>Error</h3>
                            {this.displayErrors(errors)}
                        </Message>
                    ): null}
                    <Message> 
                       Don't have an account? <Link to="/register">Login</Link>
                    </Message>
                </Grid.Column>
            </Grid>
        )
    }
}

export default Login;