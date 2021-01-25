import React from "react";
import "./App.css";
import { ThemeProvider, makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  createMuiTheme,
  CssBaseline,
  List,
  Toolbar,
  Typography,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Button,
} from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import FileCopyIcon from "@material-ui/icons/FileCopy";

import DND from "./components/DragAndDrop/DragAndDrop";

const parseTorrent = require("parse-torrent");
const customTheme = createMuiTheme({});

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appbar: {
    backgroundColor: "white",
    color: "black",
    flexGrow: 1,
  },
  appbarTitle: {
    // flexGrow: 1,
  },
  toolbar: {
    paddingLeft: theme.spacing(1),
  },
  pageContent: {
    flexGrow: 1,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    [theme.breakpoints.down("md")]: {
      height: "calc(100vh - 56px)",
    },
    [theme.breakpoints.up("md")]: {
      height: "calc(100vh - 64px)",
    },
  },
  toolbarAction: {
    marginRight: theme.spacing(1),
    // backgroundColor: "red",
  },
  list: {},
  listItem: {
    borderRadius: "4px",
  },
}));

function App() {
  const [magnetList, setMagnetList] = React.useState([]);
  const classes = useStyles();
  const [checked, setChecked] = React.useState([0]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const clearAll = () => {
    setMagnetList([]);
    setChecked([]);
  };

  const copyAll = () => {
    console.log(magnetList);
  };

  const fileOnDrop = async (files) => {
    const readFileAsync = (file) =>
      new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = function () {
          const arrayBuffer = reader.result;
          const bf = Buffer.from(arrayBuffer);
          const torrentFile = parseTorrent(bf);
          const magnetLink = `magnet:?xt=urn:btih:${torrentFile.infoHash}&dn=${torrentFile.name}`;
          resolve(magnetLink);
        };
        reader.readAsArrayBuffer(file);
      });

    let tempList = [];
    for (let i = 0; i < files.length; i++) {
      tempList.push(await readFileAsync(files[i]));
    }
    setMagnetList(tempList);
  };

  const copyItem = async (text) => {
    await navigator.clipboard.writeText(text);
  };

  return (
    <div className={classes.root}>
      <ThemeProvider theme={customTheme}>
        <CssBaseline />
        <AppBar className={classes.appbar} elevation={0}>
          <Toolbar variant={"dense"}>
            <Typography variant="h6" className={classes.appbarTitle}>
              Torrent to Magnet Link
            </Typography>
          </Toolbar>
        </AppBar>
        <main>
          <Toolbar variant={"dense"} />
          <div className={classes.pageContent}>
            {magnetList.length <= 0 ? (
              <DND onDrop={fileOnDrop} acceptType={["torrent"]} />
            ) : (
              <div>
                <Toolbar variant={"dense"} className={classes.toolbar}>
                  <Button
                    className={classes.toolbarAction}
                    variant={"contained"}
                    color={"secondary"}
                    onClick={clearAll}
                  >
                    CLEAR ALL
                  </Button>
                  <Button
                    className={classes.toolbarAction}
                    variant={"contained"}
                    color={"primary"}
                    onClick={copyAll}
                  >
                    COPY ALL
                  </Button>
                  <Button
                    className={classes.toolbarAction}
                    variant={"contained"}
                    color={"primary"}
                    onClick={copyAll}
                  >
                    COPY SELECTED
                  </Button>
                </Toolbar>

                <List className={classes.list}>
                  {magnetList.map((item, index) => {
                    return (
                      <ListItem
                        className={classes.listItem}
                        key={index}
                        dense
                        button
                        onClick={handleToggle(item)}
                        disableRipple
                      >
                        <ListItemIcon>
                          <Checkbox
                            edge="start"
                            checked={checked.indexOf(item) !== -1}
                            tabIndex={-1}
                            disableRipple
                          />
                        </ListItemIcon>
                        <ListItemText>
                          <Typography noWrap>{item}</Typography>
                        </ListItemText>
                        <ListItemSecondaryAction
                          onClick={() => {
                            copyItem(item);
                          }}
                        >
                          <IconButton edge="end" aria-label="comments">
                            <FileCopyIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    );
                  })}
                </List>
              </div>
            )}
          </div>
        </main>
      </ThemeProvider>
    </div>
  );
}

export default App;
