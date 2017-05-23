import Drawer from "material-ui/Drawer";

const LeftMenu = props => {
  return (
    <Drawer
      docked={false}
      open={props.open}
      onRequestChange={props.onRequestChange}
    >
      {props.children}
    </Drawer>
  );
};

export default LeftMenu;
