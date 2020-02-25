import React from 'react';
import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import md5 from 'md5';

import firebase from '../../firebase';

class Register extends React.Component {
    state = {
        username: '',
        email: '',
        password: '',
        passwordConfirmation: '',
        errors: [],
        loading: false,
        usersRef: firebase.database().ref('users')
    }
    handleChange = event => {
        let { name, value } = event.target;

        this.setState({ [name]: value})
    }

    isFormValid = () => {
        let errors = [];
        let error;

        if(this.isFormEmpty()) {
            error = { message: 'Please fill all fields'};
            this.setState({ errors: errors.concat(error)});
            return false;
        }else if(!this.isPasswordValid()) {
            error = {message: 'Password is Invalid'};
            this.setState({ errors: errors.concat(error)});
            return false;
        }else {
            return true;
        }
    }

    isFormEmpty = () => {
        let { username, email, password, passwordConfirmation } = this.state;

        return !username.length || !email.length || !password.length || !passwordConfirmation.length;
    }

    isPasswordValid = () => {
        let { password, passwordConfirmation } = this.state;

        if(password.length < 6 || passwordConfirmation.length < 6) {
            return false;
        } else if( passwordConfirmation !== password) {
            return false;
        } else {
            return true;
        }
    }

    displayErrors = errors => errors.map((error, i) => <p key={i}>{error.message}</p>);

    handleSubmit = event => {
        event.preventDefault();
        if(this.isFormValid()) {
            let {email, password, errors } = this.state;
            this.setState({errors: [], loading: true})
            firebase
                .auth()
                .createUserWithEmailAndPassword(email, password)
                .then(createdUser => {
                    createdUser.user.updateProfile({
                        displayName: this.state.username,
                        photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
                    })
                    .then(()=> {
                        this.saveUser(createdUser)
                            .then(() => {
                                this.setState({ loading: false});
                            })
                            .catch((err) => {
                                this.setState({ errors: this.state.errors.concat(err), loading: false});
                            })
                    })
                    .catch((err) => {
                        this.setState({ errors: this.state.errors.concat(err), loading: false});
                    })
                    
                    
                })
                .catch(err => {
                    this.setState({ errors: errors.concat(err),loading: false});
                })
        }
        
    }

    saveUser = createdUser => {
         return this.state.usersRef.child(createdUser.user.uid).set({
             name: createdUser.user.displayName,
             avatar: createdUser.user.photoURL
         });
    }

    handleInputErrors = (errors, inputName) => {
        return errors.some(error => error.message.toLowerCase().includes(inputName)) ? 'error' : '';
    }

    render() {
        let { username, email, password, passwordConfirmation, errors, loading } = this.state;
        return(
            <Grid textAlign='center' verticalAlign='middle' className="app">
                <Grid.Column style={{maxWidth: 450}}>
                    <Header as="h1" icon color="orange" textAlign="center">
                        <Icon name="puzzle piece" color="orange" />
                        Register to Chat App
                    </Header>
                    <Form size="large" onSubmit={this.handleSubmit}>
                        <Segment stacked>
                            <Form.Input fluid name="username" icon="user" iconPosition="left" value={username}
                                        placeholder="Username" onChange={this.handleChange} type="text"  />

                            <Form.Input fluid name="email" icon="mail" iconPosition="left" value={email}
                                        placeholder="Email Address" onChange={this.handleChange} type="email" 
                                        className={this.handleInputErrors(errors, 'email')} />

                            <Form.Input fluid name="password" icon="lock" iconPosition="left" value={password}
                                        placeholder="Password" onChange={this.handleChange} type="password" 
                                        className={this.handleInputErrors(errors, 'password')} />

                            <Form.Input fluid name="passwordConfirmation" icon="repeat" iconPosition="left"  value={passwordConfirmation}
                                        placeholder="Password Confirmation" onChange={this.handleChange} type="password" 
                                        className={this.handleInputErrors(errors, 'password')} />

                            <Button disabled={loading} className={loading ? 'loading': ''} color="orange" fluid size="large">Submit</Button>
                        </Segment>
                    </Form>
                    { errors.length > 0 ? (
                        <Message error>
                            <h3>Error</h3>
                            {this.displayErrors(errors)}
                        </Message>
                    ): null}
                    <Message> 
                        Already a user? <Link to="/login">Login</Link>
                    </Message>
                </Grid.Column>
            </Grid>
        )
    }
}

export default Register;