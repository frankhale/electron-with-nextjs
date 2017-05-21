import Drawer from "material-ui/Drawer";

const LeftMenu = props => {
  return (
    <Drawer
      id="NavigationDrawer"
      docked={false}
      open={props.open}
      onRequestChange={props.onRequestChange}
    >
      {props.children}
    </Drawer>
  );
};

export default LeftMenu;
