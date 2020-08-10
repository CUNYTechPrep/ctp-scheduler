import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Field } from "redux-form";
import TextField from "components/FormTextField";
import ProviderDataForm from "../ProviderDataForm";
import styles from "./AccountForm.styles";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
} from "@material-ui/core";

const useStyles = makeStyles(styles);

function AccountForm({ account, handleSubmit, submitting, pristine }) {
  const classes = useStyles();

  return (
    <Card >
      <form className={classes.root} onSubmit={handleSubmit}>
        <CardHeader subheader="The information can be edited" title="Profile" />
        <Divider />
        <CardContent>
          <div className={classes.fields}>
            <Field
              fullWidth
              name="displayName"
              component={TextField}
              label="Display Name"
            />
            <Field name="email" label="Email" component={TextField} fullWidth />
            <Field
              name="avatarUrl"
              label="Avatar Url"
              component={TextField}
              fullWidth
            />
          </div>
          {!!account && !!account.providerData && (
            <div>
              <Typography variant="h4">Linked Accounts</Typography>
              <ProviderDataForm providerData={account.providerData} />
            </div>
          )}
        </CardContent>
        <CardActions>
          <Button
            color="primary"
            type="submit"
            disabled={pristine || submitting}
          >
            {submitting ? "Saving" : "Save"}
          </Button>
        </CardActions>
      </form>
    </Card>
  );
}

AccountForm.propTypes = {
  account: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired, // from enhancer (reduxForm)
  pristine: PropTypes.bool.isRequired, // from enhancer (reduxForm)
  submitting: PropTypes.bool.isRequired, // from enhancer (reduxForm)
};

export default AccountForm;
