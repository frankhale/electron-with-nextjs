import Head from "next/head";

import io from "socket.io-client";

import React, { Component } from "react";
import injectTapEventPlugin from "react-tap-event-plugin";
import darkBaseTheme from "material-ui/styles/baseThemes/darkBaseTheme";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Drawer from "material-ui/Drawer";
import MenuItem from "material-ui/MenuItem";
import IconButton from "material-ui/IconButton";
import HamburgerIcon from "material-ui/svg-icons/navigation/menu";
import HomeIcon from "material-ui/svg-icons/action/home";
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
  ToolbarTitle
} from "material-ui/Toolbar";

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
try {
  if (typeof window !== "undefined") {
    injectTapEventPlugin();
  }
} catch (e) {}

const _muiTheme = getMuiTheme(darkBaseTheme);

class Main extends Component {
  static getInitialProps({ req }) {
    const userAgent = req ? req.headers["user-agent"] : navigator.userAgent;
    const isServer = !!req;
    return { isServer, userAgent };
  }

  constructor(props, context) {
    super(props, context);

    this.state = {
      open: false,
      title: "Loading..."
    };
  }

  componentDidMount() {
    fetch("/api/info")
      .then(response => {
        return response.json();
      })
      .then(json => {
        this.setState({
          title: json.title
        });
      });

    this.socket = io();
    this.socket.emit("message", "test message");
  }

  componentWillUnmount() {
    this.socket.close();
  }

  handleToggle = () => this.setState({ open: !this.state.open });
  handleClose = () => this.setState({ open: false });

  render() {
    const { userAgent } = this.props;
    const muiTheme = getMuiTheme(
      {
        userAgent: userAgent
      },
      _muiTheme
    );

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div
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
          <Toolbar style={{ backgroundColor: muiTheme.palette.canvasColor }}>
            <ToolbarGroup firstChild={true}>
              <IconButton>
                <HamburgerIcon onTouchTap={this.handleToggle} />
              </IconButton>
            </ToolbarGroup>
          </Toolbar>
          <div
            style={{ textAlign: "center", color: "#fff", marginTop: "120px" }}
          >
            <h1>UI Goes Here</h1>
          </div>
          <Drawer
            id="NavigationDrawer"
            docked={false}
            open={this.state.open}
            onRequestChange={open => this.setState({ open })}
          >
            <MenuItem onTouchTap={this.handleClose} leftIcon={<HomeIcon />}>
              Home
            </MenuItem>
          </Drawer>
          <Head>
            <title>{this.state.title}</title>
            <link
              href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
              rel="stylesheet"
            />
            <link rel="stylesheet" type="text/css" href="./static/app.css" />
          </Head>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default Main;
