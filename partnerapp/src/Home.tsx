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
  CardSubtitle,
} from "reactstrap";
import { useLocalStorage } from "./utils";
import { useHistory } from "react-router-dom";

import { CampaignStore } from "./campaign-store";
import { observer } from "mobx-react-lite";
import { getUser } from "./interaction-designer-api";

export const HomeView: FC<{
  store: CampaignStore;
}> = observer(({ store }) => {
  const [tmpApiToken, setTmpApiToken] = useState("");
  const [apiToken, setApiToken] = useLocalStorage("giosg_api_token", "");

  const onTokenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTmpApiToken(event.target.value);
  };
  const onAddTokenClick = () => {
    setApiToken(tmpApiToken);
  };
  const onTokenRemoveClick = () => {
    setApiToken("");
  };

  return (
    <Col sm="12" md={{ size: 9, offset: 2 }}>
      <h1>Welcome to ID embedding demo.</h1>
      <p>
        This is a demo application for Giosg partners to introduce how Giosg
        Interaction Designer could be embedded inside partner application.
      </p>

      {apiToken === "" ? (
        <ApiTokenForm
          onAddTokenClick={onAddTokenClick}
          onTokenChange={onTokenChange}
        ></ApiTokenForm>
      ) : (
        <ApiTokenInfo onTokenRemoveClick={onTokenRemoveClick}></ApiTokenInfo>
      )}
    </Col>
  );
});

export const ApiTokenForm: FC<{
  onAddTokenClick: () => void;
  onTokenChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}> = observer(({ onAddTokenClick, onTokenChange }) => {
  return (
    <>
      <Card>
        <CardBody>
          <CardTitle tag="h5">
            Login to Giosg account and give your API token which is needed in
            order for this demo to work. API token needs to be associated to
            same Giosg account.
            <br />
            <a href="https://service.giosg.com/settings/live/company/tokens">
              Click here to create new API token.
            </a>
          </CardTitle>
          <CardSubtitle tag="h6" className="mb-2" style={{ marginTop: "20px" }}>
            Giosg account should preferably have following features enabled:
          </CardSubtitle>

          <ul>
            <li>interaction_designer</li>
            <li>id_whitelabel</li>
            <li>id_publish_flow_hidden</li>
            <li>id_collections_hidden</li>
          </ul>

          <Form>
            <FormGroup row>
              <Label for="api-token" sm={2}>
                API token
              </Label>
              <Col sm={10}>
                <Input
                  type="text"
                  name="api-token"
                  id="api-token"
                  placeholder="Type in API token"
                  onChange={onTokenChange}
                />
              </Col>
            </FormGroup>

            <FormGroup className={"float-right"}>
              <Button color="primary" onClick={onAddTokenClick}>
                Save API token
              </Button>
            </FormGroup>
          </Form>
        </CardBody>
      </Card>
    </>
  );
});

const ApiTokenInfo: FC<{
  onTokenRemoveClick: () => void;
}> = observer(({ onTokenRemoveClick }) => {
  const history = useHistory();

  return (
    <>
      <UserInfo></UserInfo>

      <Button
        color="primary"
        onClick={() => {
          history.push("/campaigns");
        }}
        style={{ marginRight: "10px" }}
      >
        Continue to demo
      </Button>
      <Button color="secondary" onClick={onTokenRemoveClick}>
        Remove API token
      </Button>
    </>
  );
});

const UserInfo: FC<{}> = () => {
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [user, setUser] = useState<{
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
        Oops, failed to load user information. Check that your token is correct!
      </span>
    );
  }

  return (
    <>
      <h3>Token valid for:</h3>
      <ul>
        <li>Name: {user.full_name}</li>
        <li>Organization: {user.organization.name}</li>
      </ul>
    </>
  );
};
