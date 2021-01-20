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
} from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import CommentIcon from "@material-ui/icons/Comment";
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
    flexGrow: 1,
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

  const handleFileChosen = async (event) => {
    const files = event.target.files;

    const readFileAsync = (file) =>
      new Promise((resolve) => {
        var reader = new FileReader();
        reader.onload = function () {
          var arrayBuffer = reader.result;
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

  return (
    <div className={classes.root}>
      <ThemeProvider theme={customTheme}>
        <CssBaseline />
        <AppBar className={classes.appbar} elevation={0}>
          <Toolbar variant={"dense"}>
            <Typography variant="h6" className={classes.appbarTitle}>
              Title
            </Typography>
          </Toolbar>
        </AppBar>
        <main>
          <Toolbar variant={"dense"} />
          <input
            type="file"
            accept=".torrent"
            onChange={handleFileChosen}
            multiple
          />
          {magnetList.length > 0 && (
            <List>
              {magnetList.map((item, index) => {
                return (
                  <ListItem
                    key={index}
                    role={undefined}
                    dense
                    button
                    onClick={handleToggle(item)}
                  >
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={checked.indexOf(item) !== -1}
                        tabIndex={-1}
                        disableRipple
                      />
                    </ListItemIcon>
                    <ListItemText>{item}</ListItemText>
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="comments">
                        <CommentIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
            </List>
          )}
        </main>
      </ThemeProvider>
    </div>
  );
}

export default App;
