import React from "react";
import "./App.css";
import { ThemeProvider, makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  createMuiTheme,
  CssBaseline,
  Toolbar,
  Typography,
} from "@material-ui/core";
const parseTorrent = require("parse-torrent");

const customTheme = createMuiTheme({});

const useStyle = makeStyles((theme) => ({
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
  const classes = useStyle();

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
        <AppBar className={classes.appbar}>
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
            <ul>
              {magnetList.map((item, index) => {
                return <li key={index}>{item}</li>;
              })}
            </ul>
          )}
        </main>
      </ThemeProvider>
    </div>
  );
}

export default App;
