import IconMenu from "material-ui/IconMenu";
import IconButton from "material-ui/IconButton";
import MenuItem from "material-ui/MenuItem";
import MoreVertIcon from "material-ui/svg-icons/navigation/more-vert";
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
  ToolbarTitle
} from "material-ui/Toolbar";

// TODO: We need to use prop-types to require userAgent

const RightMenu = props => {
  if (props.userAgent && props.userAgent.indexOf("Electron") > -1) {
    return (
      <ToolbarGroup lastChild={true}>
        <IconMenu
          iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
          targetOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "top" }}
        >
          {props.children}
        </IconMenu>
      </ToolbarGroup>
    );
  } else {
    return null;
  }
};

export default RightMenu;
