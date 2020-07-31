import { Theme } from "@material-ui/core";
import { createStyles } from "@material-ui/core";

const drawerWidth = 240;
const iconColor = "#FFFFFF";
const activeColor = "rgba(0, 255, 0, 1.0)";

export const styles = (theme: Theme) =>
  createStyles({
    "@global": {
      body: {
        backgroundColor: theme.palette.common.black,
      },
    },

    grow: {
      flexGrow: 1,
    },

    root: {
      display: "flex",
    },

    menuButton: {
      marginRight: theme.spacing(2),
    },

    title: {
      flexGrow: 1,
    },

    appBar: {
      position: "relative",
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },

    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },

    hide: {
      display: "none",
    },

    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: "nowrap",
    },

    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },

    drawerClose: {
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: "hidden",
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9) + 1,
      },
    },

    // Loads information about the app bar, including app bar height
    toolbar: theme.mixins.toolbar,

    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },

    listItemText: {
      fontSize: "0.85em",
      marginLeft: "-20px",
    },
  });
