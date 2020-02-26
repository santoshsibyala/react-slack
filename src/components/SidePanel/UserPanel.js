import React from "react";
import { Grid, Header, Icon, Dropdown, Image } from "semantic-ui-react";
import firebase from "../../firebase";

class UserPanel extends React.Component {
  state = {
    currentUser: this.props.currentUser
  };
  dropDownOptions = () => [
    {
      key: "user",
      text: (
        <span>
          Signed in as <strong>{this.state.currentUser.displayName}</strong>
        </span>
      ),
      disabled: true
    },
    {
      key: "avatar",
      text: <span>Change Avatar</span>
    },
    {
      key: "signOut",
      text: <span onClick={this.handleSignOut}>Sign Out</span>
    }
  ];

  handleSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => console.log("out"));
  };

  render() {
    const { currentUser } = this.state;
    return (
      <Grid style={{ background: "#4c3c4c" }}>
        <Grid.Column>
          <Grid.Row style={{ padding: "1.2em", margin: 0 }}>
            {/* App Header */}
            <Header inverted floated='left' as='h2'>
              <Icon name='code' />
              <Header.Content>DevChat</Header.Content>
            </Header>

            <Header style={{ padding: "0.25em" }} as='h4' inverted>
              <Dropdown
                trigger={
                  <span>
                    <Image src={currentUser.photoURL} spaced='right' avatar />
                    {currentUser.displayName}
                  </span>
                }
                options={this.dropDownOptions()}
              ></Dropdown>
            </Header>
          </Grid.Row>
        </Grid.Column>
      </Grid>
    );
  }
}

export default UserPanel;
