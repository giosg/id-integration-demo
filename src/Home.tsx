import React, { FC, useState, useEffect } from "react";
import {
  Button,
  Col,
  FormGroup,
  Form,
  Label,
  Input,
  Card,
  CardBody,
  CardTitle,
  Alert,
  Dropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
} from "reactstrap";
import { useLocalStorage } from "./utils";
import { useHistory } from "react-router-dom";

import { CampaignStore } from "./campaign-store";
import { observer } from "mobx-react-lite";
import {
  getUser,
  SSOLoginInfo,
  getSSOAccessToken,
  setAccessToken,
  setUserLanguage,
} from "./interaction-designer-api";

export const HomeView: FC<{
  store: CampaignStore;
}> = observer(({ store }) => {
  const history = useHistory();
  const [ssoLoginInfo, setSsoLoginInfo] = useLocalStorage(
    "sso_login_info",
    JSON.stringify({})
  );
  const hasLoginInfo =
    ssoLoginInfo && JSON.parse(ssoLoginInfo).email ? true : false;

  const onSSOLoginClick = async (
    loginForm: SSOLoginInfo,
    language: { name: string; code: string }
  ) => {
    try {
      const accessToken = await getSSOAccessToken(loginForm);
      // Login was successfull, lets store login form info for future use
      setSsoLoginInfo(JSON.stringify(loginForm));
      setAccessToken(accessToken);

      // Set users language
      await setUserLanguage(language.code);

      history.push("/");
    } catch (e) {
      alert(e);
    }
  };
  const onRemoveLoginInfoClick = () => {
    setSsoLoginInfo(JSON.stringify({}));
  };

  return (
    <Col sm="12" md={{ size: 9, offset: 2 }}>
      <h1>Welcome to ID embedding demo.</h1>
      <p>
        This is a demo application for Giosg partners to introduce how Giosg
        Interaction Designer could be embedded inside partner application.
      </p>
      <Alert color="warning">
        <strong>Note</strong> that this example should be run from HTTPS site or
        the iframing might not work due to browsers security restrictions!
      </Alert>

      {!hasLoginInfo ? (
        <SSOLoginForm
          previousLoginInfo={ssoLoginInfo}
          onSSOLoginClick={onSSOLoginClick}
        ></SSOLoginForm>
      ) : (
        <SSOLoggedinUserInfo
          onSSOInfoRemove={onRemoveLoginInfoClick}
        ></SSOLoggedinUserInfo>
      )}
    </Col>
  );
});

export const SSOLoginForm: FC<{
  previousLoginInfo: SSOLoginInfo | undefined;
  onSSOLoginClick: (
    loginForm: SSOLoginInfo,
    language: { name: string; code: string }
  ) => Promise<void>;
}> = observer(({ onSSOLoginClick }) => {
  const [loginForm, setLoginForm] = useState({
    email: "",
    organizationId: "",
    clientId: "",
    clientSecret: "",
    firstName: "",
    lastName: "",
  });
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const availableLanguages = [
    { name: "English", code: "en" },
    { name: "Korean", code: "ko" },
    { name: "Japanese", code: "ja" },
    { name: "Chinese (Traditionel)", code: "zh-hant" },
    { name: "Chinese (Simplified)", code: "zh-hans" },
  ];
  const [selectedLanguage, setSelectedLanguage] = useState(
    availableLanguages[0]
  );
  const languageChoices = availableLanguages.map((lng) => {
    return (
      <DropdownItem key={lng.code} onClick={() => setSelectedLanguage(lng)}>
        {lng.name}
      </DropdownItem>
    );
  });
  const toggleLanguageDropdown = () =>
    setLanguageDropdownOpen((prevState) => !prevState);

  console.log(loginForm);
  return (
    <>
      <Card>
        <CardBody>
          <CardTitle tag="h5">
            This demo includes Giosg Single Sign-On. To configure your SSO and
            login, please fill in the form below.
            <br />
          </CardTitle>
          <a href="https://developers.giosg.com/authentication.html#single-sign-on-authentication">
            Click here to read more about Giosg SSO.
          </a>

          <CardTitle tag="h5" style={{ marginTop: "40px" }}>
            Fill in the fields for requesting SSO token
          </CardTitle>

          <Form>
            <FormGroup row>
              <Label for="organization_id" sm={3}>
                Organization ID
              </Label>
              <Col sm={9}>
                <Input
                  type="text"
                  name="organization_id"
                  id="organization_id"
                  placeholder="Type in organization UUID"
                  onChange={(e) =>
                    setLoginForm({
                      ...loginForm,
                      organizationId: e.target.value,
                    })
                  }
                />
              </Col>
            </FormGroup>

            <FormGroup row>
              <Label for="client_id" sm={3}>
                Client ID
              </Label>
              <Col sm={9}>
                <Input
                  type="text"
                  name="client_id"
                  id="client_id"
                  placeholder="Type in client ID (Giosg App ID)"
                  onChange={(e) =>
                    setLoginForm({
                      ...loginForm,
                      clientId: e.target.value,
                    })
                  }
                />
              </Col>
            </FormGroup>

            <FormGroup row>
              <Label for="client_secret" sm={3}>
                Client secret
              </Label>
              <Col sm={9}>
                <Input
                  type="text"
                  name="client_secret"
                  id="client_secret"
                  placeholder="Type in client secret (Giosg App secret)"
                  onChange={(e) =>
                    setLoginForm({
                      ...loginForm,
                      clientSecret: e.target.value,
                    })
                  }
                />
              </Col>
            </FormGroup>

            <FormGroup row>
              <Label for="email" sm={3}>
                Email
              </Label>
              <Col sm={9}>
                <Input
                  type="text"
                  name="email"
                  id="email"
                  placeholder="Type in email of the user you want to log in"
                  onChange={(e) =>
                    setLoginForm({
                      ...loginForm,
                      email: e.target.value,
                    })
                  }
                />
              </Col>
            </FormGroup>

            <FormGroup row>
              <Label for="first_name" sm={3}>
                First name
              </Label>
              <Col sm={9}>
                <Input
                  type="text"
                  name="first_name"
                  id="first_name"
                  placeholder="Type in the first name of the user"
                  onChange={(e) =>
                    setLoginForm({
                      ...loginForm,
                      firstName: e.target.value,
                    })
                  }
                />
              </Col>
            </FormGroup>

            <FormGroup row>
              <Label for="last_name" sm={3}>
                Last name
              </Label>
              <Col sm={9}>
                <Input
                  type="text"
                  name="last_name"
                  id="last_name"
                  placeholder="Type in the last name of the user"
                  onChange={(e) =>
                    setLoginForm({
                      ...loginForm,
                      lastName: e.target.value,
                    })
                  }
                />
              </Col>
            </FormGroup>

            <FormGroup row>
              <Label for="language" sm={3}>
                Language
              </Label>
              <Col sm={9}>
                <Dropdown
                  name="language"
                  id="language"
                  isOpen={languageDropdownOpen}
                  toggle={toggleLanguageDropdown}
                >
                  <DropdownToggle caret>{selectedLanguage.name}</DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem header>Available languages</DropdownItem>
                    {languageChoices}
                  </DropdownMenu>
                </Dropdown>
              </Col>
            </FormGroup>

            <FormGroup className={"float-right"}>
              <Button
                color="primary"
                onClick={() => {
                  onSSOLoginClick(loginForm, selectedLanguage);
                }}
              >
                Login with SSO
              </Button>
            </FormGroup>
          </Form>
        </CardBody>
      </Card>
    </>
  );
});

const SSOLoggedinUserInfo: FC<{
  onSSOInfoRemove: () => void;
}> = observer(({ onSSOInfoRemove }) => {
  const history = useHistory();

  return (
    <>
      <Card>
        <CardBody>
          <CardTitle tag="h5">
            User information
            <br />
          </CardTitle>

          <UserInfo></UserInfo>

          <div style={{ marginTop: "20px" }}>
            <Button
              color="primary"
              onClick={() => {
                history.push("/campaigns");
              }}
              style={{ marginRight: "10px" }}
            >
              Continue to demo
            </Button>
            <Button color="secondary" onClick={onSSOInfoRemove}>
              Remove SSO data and logout
            </Button>
          </div>
        </CardBody>
      </Card>
    </>
  );
});

const UserInfo: FC<{}> = () => {
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [user, setUser] =
    useState<{
      detail?: Array<string>;
      full_name: string;
      organization: { name: string };
    }>();

  useEffect(() => {
    async function loadUserInfo() {
      if (isLoadingUser) {
        const userInfo = await getUser();
        console.log(userInfo);
        setUser(userInfo);
        setIsLoadingUser(false);
      }
    }
    loadUserInfo();
  });
  if (isLoadingUser) {
    return <span>Loading..</span>;
  }
  if (!user || user.detail) {
    return (
      <span>
        Oops, failed to load user information. Check that your SSO login
        information is correct!
      </span>
    );
  }

  return (
    <>
      <h3>Logged in successfully:</h3>
      <ul>
        <li>Name: {user.full_name}</li>
        <li>Organization: {user.organization.name}</li>
      </ul>
    </>
  );
};
