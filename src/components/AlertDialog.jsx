import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

export default class AlertDialog extends Component {
  render() {
    return (
      <div>
        <Dialog
          open={this.props.openDialog}
          onClose={this.props.handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Sure you want to remove your comment?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Removing your comment will hide all replies for other users,
              including high quality ones.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.props.handleCloseDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={this.props.deleteQuestion} color="primary" autoFocus>
              Delete Anyway
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
