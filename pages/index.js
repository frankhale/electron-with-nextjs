import Head from "next/head";
import io from "socket.io-client";
import React, { Component } from "react";
import Layout from "../components/layout";
import darkBaseTheme from "material-ui/styles/baseThemes/darkBaseTheme";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import Dialog from "material-ui/Dialog";
import IconMenu from "material-ui/IconMenu";
import FlatButton from "material-ui/FlatButton";
import HomeIcon from "material-ui/svg-icons/action/home";
import ListIcon from "material-ui/svg-icons/action/list";
import HamburgerIcon from "material-ui/svg-icons/navigation/menu";
import IconButton from "material-ui/IconButton";
import MenuItem from "material-ui/MenuItem";

import RightMenu from "../components/rightMenu";
import LeftMenu from "../components/leftMenu";

import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
  ToolbarTitle
} from "material-ui/Toolbar";

const muiDarkTheme = getMuiTheme(darkBaseTheme);

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
        this.socket = io(`${json.package.app.url}:${json.package.app.ioPort}`);
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
      muiDarkTheme
    );

    return (
      <Layout userAgent={userAgent}>
        <Toolbar style={{ backgroundColor: muiTheme.palette.canvasColor }}>
          <ToolbarGroup firstChild={true}>
            <IconButton>
              <HamburgerIcon onTouchTap={this.handleToggle} />
            </IconButton>
          </ToolbarGroup>
          <RightMenu userAgent={userAgent}>
            <MenuItem
              primaryText="Toggle Fullscreen"
              onTouchTap={this.handleFullScreenClick}
            />
          </RightMenu>
        </Toolbar>
        <LeftMenu
          open={this.state.open}
          onRequestChange={open => this.setState({ open })}
        >
          <MenuItem onTouchTap={this.handleHome} leftIcon={<HomeIcon />}>
            Home
          </MenuItem>
          <MenuItem onTouchTap={this.handleServerLog} leftIcon={<ListIcon />}>
            Server Log
          </MenuItem>
        </LeftMenu>
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
        <div style={{ textAlign: "center", color: "#fff", marginTop: "120px" }}>
          <h1>Hello, World!</h1>
        </div>
        <Head>
          <title>{this.state.title}</title>
          <link
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
            rel="stylesheet"
          />
          <link rel="stylesheet" type="text/css" href="./static/app.css" />
        </Head>
      </Layout>
    );
  }
}
