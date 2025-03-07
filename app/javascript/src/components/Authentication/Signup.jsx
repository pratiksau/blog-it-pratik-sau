import React, { useState, useEffect } from "react";

import authApi from "apis/auth";
import organizationsApi from "apis/organizations";
import SignupForm from "components/Authentication/Form/Signup";

const Signup = ({ history }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [organizationId, setOrganizationId] = useState("");
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingOrganizations, setFetchingOrganizations] = useState(true);

  const fetchOrganizations = async () => {
    try {
      const response = await organizationsApi.fetch();
      setOrganizations(response.data.organizations);
    } catch (error) {
      logger.error(error);
    } finally {
      setFetchingOrganizations(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const handleSubmit = async event => {
    event.preventDefault();
    setLoading(true);
    try {
      await authApi.signup({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
        organization_id: organizationId,
      });
      setLoading(false);
      history.push("/dashboard");
    } catch (error) {
      logger.error(error);
      setLoading(false);
    }
  };

  return (
    <SignupForm
      fetchingOrganizations={fetchingOrganizations}
      handleSubmit={handleSubmit}
      loading={loading}
      organizations={organizations}
      setEmail={setEmail}
      setName={setName}
      setOrganizationId={setOrganizationId}
      setPassword={setPassword}
      setPasswordConfirmation={setPasswordConfirmation}
    />
  );
};

export default Signup;
