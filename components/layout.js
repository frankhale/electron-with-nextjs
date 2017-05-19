import Head from "next/head";
import React, { Component } from "react";
import injectTapEventPlugin from "react-tap-event-plugin";
import darkBaseTheme from "material-ui/styles/baseThemes/darkBaseTheme";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
try {
  if (typeof window !== "undefined") {
    injectTapEventPlugin();
  }
} catch (e) {}

const muiDarkTheme = getMuiTheme(darkBaseTheme);

export default class Layout extends Component {
  render() {
    const { userAgent } = this.props;
    const muiTheme = getMuiTheme(
      {
        userAgent: userAgent
      },
      muiDarkTheme
    );

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div
          id="nextAppContent"
          style={{
            backgroundColor: muiTheme.palette.canvasColor,
            position: "absolute",
            top: "0",
            left: "0",
            minWidth: "100%",
            minHeight: "100%",
            width: "100%",
            height: "100%",
            overflow: "auto"
          }}
        >
          {this.props.children}
        </div>
      </MuiThemeProvider>
    );
  }
}
