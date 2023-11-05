import React, { useState, useEffect } from "react";
import { Button, Form, Grid, Header, Segment, Table } from "semantic-ui-react";
import api from "../../api/api";
import { useAuth } from "../../contexts/AuthContext";

const Profile = () => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const { user: userDetails } = useAuth();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get(`/user/${userDetails?.userId}`);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user profile: ", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleSaveClick = async () => {
    try {
      await api.put(`/user/${userDetails?.userId}`, user);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user profile: ", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  return (
    <Grid
      textAlign="center"
      style={{ height: "100vh", marginTop: 50 }}
      verticalAlign="top"
    >
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" color="teal" textAlign="center">
          User Profile
        </Header>
        {isEditing ? (
          <Form size="large">
            <Segment stacked>
              <Form.Input
                fluid
                icon="user"
                iconPosition="left"
                placeholder="First Name"
                name="firstName"
                value={user.firstName}
                onChange={handleChange}
              />
              <Form.Input
                fluid
                icon="user"
                iconPosition="left"
                placeholder="Last Name"
                name="lastName"
                value={user.lastName}
                onChange={handleChange}
              />
              <Form.Input
                fluid
                icon="mail"
                iconPosition="left"
                placeholder="E-mail address"
                name="email"
                value={user.email}
                onChange={handleChange}
              />
              <Button.Group fluid>
                <Button color="teal" onClick={handleSaveClick}>
                  Save
                </Button>
                <Button.Or />
                <Button onClick={handleCancelClick}>Cancel</Button>
              </Button.Group>
            </Segment>
          </Form>
        ) : (
          <Table definition>
            <Table.Body>
              <Table.Row>
                <Table.Cell width={4}>First Name</Table.Cell>
                <Table.Cell>{user.firstName}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Last Name</Table.Cell>
                <Table.Cell>{user.lastName}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Email</Table.Cell>
                <Table.Cell>{user.email}</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        )}
        {!isEditing && (
          <Button color="teal" onClick={handleEditClick}>
            Edit Profile
          </Button>
        )}
      </Grid.Column>
    </Grid>
  );
};

export default Profile;
