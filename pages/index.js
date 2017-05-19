import Head from "next/head";
import io from "socket.io-client";
import React, { Component } from "react";
import injectTapEventPlugin from "react-tap-event-plugin";
import darkBaseTheme from "material-ui/styles/baseThemes/darkBaseTheme";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Dialog from "material-ui/Dialog";
import Drawer from "material-ui/Drawer";
import IconMenu from "material-ui/IconMenu";
import MenuItem from "material-ui/MenuItem";
import FlatButton from "material-ui/FlatButton";
import IconButton from "material-ui/IconButton";
import HamburgerIcon from "material-ui/svg-icons/navigation/menu";
import HomeIcon from "material-ui/svg-icons/action/home";
import ListIcon from "material-ui/svg-icons/action/list";

import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
  ToolbarTitle
} from "material-ui/Toolbar";

import RightSideMenu from "../components/rightSideMenu";

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
try {
  if (typeof window !== "undefined") {
    injectTapEventPlugin();
  }
} catch (e) {}

const _muiTheme = getMuiTheme(darkBaseTheme);

const customContentStyle = {
  width: "100%",
  maxWidth: "none"
},
  serverLogStyle = {
    padding: "5px",
    overflow: "auto !important"
  };

export default class Main extends Component {
  static getInitialProps({ req }) {
    const userAgent = req ? req.headers["user-agent"] : navigator.userAgent;
    const isServer = !!req;
    return { isServer, userAgent };
  }

  constructor(props, context) {
    super(props, context);

    this.state = {
      open: false,
      serverLogOpen: false,
      title: "Loading...",
      serverLog: [],
      fullscreen: false
    };
  }

  componentDidMount() {
    fetch("/api/info")
      .then(response => {
        return response.json();
      })
      .then(json => {
        //console.log(json);
        this.socket = io(`${json.package.url}:${json.package.ioPort}`);
        this.socket.on("server-output", output => {
          this.setState({
            serverLog: output
          });
        });

        this.setState({
          title: json.title
        });
      });
  }

  componentWillUnmount() {
    this.socket.close();
  }

  handleToggle = () => this.setState({ open: !this.state.open });
  handleServerLogDialogClose = () => this.setState({ serverLogOpen: false });
  handleHome = () => {
    this.setState({ open: false });
  };
  handleServerLog = () => {
    this.socket.emit("get-server-output");
    this.setState({
      open: false,
      serverLogOpen: true
    });
  };
  handleFullScreenClick = () => {
    this.socket.emit("toggle-fullscreen");

    // I want to do the code below but menu's and dialogs stop working! FUCK!
    //
    // let elem = document.getElementById("nextAppContent");
    // if (elem.webkitRequestFullscreen) {
    //   this.setState(
    //     {
    //       fullscreen: !this.state.fullscreen
    //     },
    //     () => {
    //       if (this.state.fullscreen) {
    //         elem.webkitRequestFullscreen();
    //       } else {
    //         elem.webkitExitFullscreen();
    //       }
    //     }
    //   );
    // }
  };

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
          <Toolbar style={{ backgroundColor: muiTheme.palette.canvasColor }}>
            <ToolbarGroup firstChild={true}>
              <IconButton>
                <HamburgerIcon onTouchTap={this.handleToggle} />
              </IconButton>
            </ToolbarGroup>
            <RightSideMenu userAgent={userAgent}>
              <MenuItem
                primaryText="Toggle Fullscreen"
                onTouchTap={this.handleFullScreenClick}
              />
            </RightSideMenu>
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
            <MenuItem onTouchTap={this.handleHome} leftIcon={<HomeIcon />}>
              Home
            </MenuItem>
            <MenuItem onTouchTap={this.handleServerLog} leftIcon={<ListIcon />}>
              Server Log
            </MenuItem>
          </Drawer>
          <Dialog
            title="Next.JS Server Log"
            actions={
              <FlatButton
                label="Ok"
                primary={true}
                onTouchTap={this.handleServerLogDialogClose}
              />
            }
            modal={true}
            contentStyle={customContentStyle}
            open={this.state.serverLogOpen}
            autoScrollBodyContent={true}
          >
            <pre>
              {this.state.serverLog.join("")}
            </pre>
          </Dialog>
          <Head>
            <title>{this.state.title}</title>
          </Head>
        </div>
      </MuiThemeProvider>
    );
  }
}
